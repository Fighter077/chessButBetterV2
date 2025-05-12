import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { Field, Game, Move, Piece } from '../../interfaces/game';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { UserService } from '../user/user.service';
import { GameEvent, QueueEvent } from '../../interfaces/websocket';
import { getInitialBoard } from '../../constants/chess.constants';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.backendUrl + '/games';
  private client: Client | null = null;

  private gameClient: Client | null = null; // Client for the game events

  private queueSubscription: StompSubscription | undefined; // Subscription to the queue events
  private gameSubscriptions = new Map<number, StompSubscription>(); // New: Track subscriptions by gameId
  private gameObservers = new Map<number, (event: GameEvent) => void>(); // Store observers to emit events per game

  constructor(private http: HttpClient, private userService: UserService) { }

  private ensureClientConnected(onConnectCallback?: () => void): void {
    if (this.client && this.client.active) return;

    this.client = new Client({
      brokerURL: this.apiUrl + '/game',
      webSocketFactory: () => new SockJS(this.apiUrl + '/game'),
      connectHeaders: {
        sessionID: this.userService.getSessionID()!,
        wsType: 'game',
      },
      onConnect: () => {
        console.log('WebSocket connected');
        onConnectCallback?.();
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message'], frame.body);
      }
    });

    this.client.activate();
  }

  getActiveGame(): Observable<Game | null> {
    return this.http.get<Game>(`${this.apiUrl}/active`).pipe(
      // return game on success, null on 404 error
      catchError((error) => {
        if (error.status === 404) {
          return of(null); // Return null if no active game is found
        } else {
          throw error; // Rethrow other errors
        }
      })
    );
  }

  joinQueue(): Observable<QueueEvent> {
    return new Observable<QueueEvent>((observer) => {
      const onQueueMessageRecieved = (message: Message) => {
        const event = JSON.parse(message.body) as QueueEvent;
        if (event.type === 'MATCH_FOUND') {
          this.client?.deactivate();
        }
        observer.next(event);
      };


      if (!this.client?.active) {
        this.client = new Client({
          brokerURL: this.apiUrl + '/queue',
          webSocketFactory: () => new SockJS(this.apiUrl + '/queue'),
          connectHeaders: {
            sessionID: this.userService.getSessionID()!,
            wsType: 'queue',
          },
          onConnect: () => {
            if (this.queueSubscription) {
              this.queueSubscription.unsubscribe(); // Unsubscribe from the previous subscription if it exists
            }
            this.queueSubscription = this.client?.subscribe('/user/queue', (message: Message) => {
              onQueueMessageRecieved(message);
            });
          },
          onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
          },
        });

        this.client.activate();
      }
    });
  }

  disconnectQueue(): void {
    if (this.client !== null) {
      this.client.deactivate();
    }
    if (this.queueSubscription) {
      this.queueSubscription.unsubscribe(); // Unsubscribe from the queue events
    }
  }

  joinGame(gameId: number): Observable<GameEvent> {
    return new Observable<GameEvent>((observer) => {
      if (this.gameSubscriptions.has(gameId)) {
        // Already subscribed
        return;
      }

      this.ensureClientConnected(() => {
        const destination = `/game/${gameId}`;
        const subscription = this.client!.subscribe(destination, (message: Message) => {
          const event = JSON.parse(message.body) as GameEvent;
          this.gameObservers.get(gameId)?.(event);
        });

        this.gameSubscriptions.set(gameId, subscription);
        this.gameObservers.set(gameId, (event: GameEvent) => observer.next(event));
      });
    });
  }

  leaveGame(gameId: number): void {
    const subscription = this.gameSubscriptions.get(gameId);
    if (subscription) {
      subscription.unsubscribe();
      this.gameSubscriptions.delete(gameId);
      this.gameObservers.delete(gameId);
    }

    // Disconnect WebSocket if no games are subscribed
    if (this.gameSubscriptions.size === 0 && this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  pieceMoved(game: Game, move: Move): void {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `/app/game/${game.id}/move`,
        body: JSON.stringify(move),
      });
    }
  }

  // Optional manual disconnect (e.g., on logout)
  disconnectAll(): void {
    for (const subscription of Array.from(this.gameSubscriptions.values())) {
      subscription.unsubscribe();
    }
    this.gameSubscriptions.clear();
    this.gameObservers.clear();

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  }

  movesToBoard(moves: string[], board: Field[][] | null = null): Field[][] {
    if (board === null) {
      //create initial board with pieces
      board = getInitialBoard();
    }

    //apply moves to the board
    //moves indicate the from cell and to cell of the move like: "e2e4"
    moves.forEach((move) => {
      this.movePieceOnBoard(board, move);
    });
    return board;
  }

  //Moves piece object to the target field on the board
  movePieceOnBoard(board: Field[][], move: string): void {
    const { fromRow, fromCol, toRow, toCol } = this.convertFromMove(move);

    //move piece from from cell to to cell
    board[toRow][toCol].piece = board[fromRow][fromCol].piece;
    board[fromRow][fromCol].piece = null;

    const piece = board[toRow][toCol].piece;
    const to = board[toRow][toCol];

    //update piece's row and column
    if (piece) {
      piece.row = to.row; // Update piece's row
      piece.column = to.column; // Update piece's column
    }
  }

  //convert move from "e2e4" to {fromRow: 1, fromCol: 4, toRow: 3, toCol: 4}
  //Preconditions: move is a string in the format "e2e4"
  //Postconditions: returns a move object with the move in the format {fromRow: 1, fromCol: 4, toRow: 3, toCol: 4}
  convertFromMove(move: string): { fromRow: number, fromCol: number, toRow: number, toCol: number } {
    const fromCol = move.charCodeAt(0) - 'a'.charCodeAt(0); // Convert column letter to number
    const fromRow = parseInt(move[1]) - 1; // Convert row number to 0-indexed
    const toCol = move.charCodeAt(2) - 'a'.charCodeAt(0); // Convert column letter to number
    const toRow = parseInt(move[3]) - 1; // Convert row number to 0-indexed

    return {
      fromRow: fromRow,
      fromCol: fromCol,
      toRow: toRow,
      toCol: toCol
    };
  }


  //Preconditions: fromRow and fromCol are the coordinates of the piece to move (0-7)
  //toRow and toCol are the coordinates of the target cell (0-7)
  //Postconditions: returns a move object with the move in the format "e2e4"
  //Example: fromCol = 4, fromRow = 1, toCol = 4, toRow = 3 => move = "e2e4"
  convertToMove(fromCol: number, fromRow: number, toCol: number, toRow: number): Move {
    let move: string = '';
    move += String.fromCharCode(fromCol + 'a'.charCodeAt(0)); // Convert column to letter
    move += (1 + fromRow).toString(); // Convert row to number
    move += String.fromCharCode(toCol + 'a'.charCodeAt(0)); // Convert column to letter
    move += (1 + toRow).toString(); // Convert row to number
    return {
      'move': move
    }
  }
}
