import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Field, Game, Move } from '../../interfaces/game';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { UserService } from '../user/user.service';
import { GameEvent, QueueEvent } from '../../interfaces/websocket';
import { getInitialBoard } from '../../constants/chess.constants';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.backendUrl + '/game';
  private wsUrl = environment.backendUrl + '/games';

  private queueClient: Client | null = null;
  private gameClient: Client | null = null; // Client for the game events

  private queueSubscription: StompSubscription | undefined; // Subscription to the queue events
  private gameSubscriptions = new Map<number, StompSubscription>(); // New: Track subscriptions by gameId
  private pendingGameSubscriptions: (() => void)[] = [];

  private connectedGameSubscriptions: (() => void)[] = []; // Store pending subscriptions so they can be resubscribed

  private gameObservers = new Map<number, (event: GameEvent) => void>(); // Store observers to emit events per game

  constructor(private http: HttpClient, private userService: UserService) { }

  private ensureClientConnected(onConnectCallback?: () => void): void {
    if (this.gameClient && this.gameClient.connected) {
      // Client is already connected, execute callback immediately
      onConnectCallback?.();
      return;
    }

    if (onConnectCallback) {
      // Queue the callback to be executed once connected
      this.pendingGameSubscriptions.push(onConnectCallback);
    }

    if (this.gameClient && this.gameClient.active) {
      // Already trying to connect, just queue the callback
      return;
    }

    this.gameClient = new Client({
      brokerURL: this.wsUrl + '/game',
      webSocketFactory: () => new SockJS(this.wsUrl + '/game'),
      connectHeaders: {
        sessionID: this.userService.getSessionID()!,
        wsType: 'game',
      },
      onConnect: () => {
        // Process all queued subscriptions
        this.pendingGameSubscriptions.forEach(callback => {
          this.connectedGameSubscriptions.push(callback);
          callback();
        });
        this.pendingGameSubscriptions = [];
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message'], frame.body);
      },
      onWebSocketClose: () => {
        // Attempt to reconnect
        this.connectedGameSubscriptions.forEach(callback => this.pendingGameSubscriptions.push(callback));
        this.connectedGameSubscriptions = [];
      }
    });

    this.gameClient.activate();
  }

  getActiveGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/active`).pipe(
      // return game on success, null on 404 error
      catchError((error) => {
        if (error.status === 404) {
          return of([]); // Return null if no active game is found
        } else {
          throw error; // Rethrow other errors
        }
      })
    );
  }

  getGame(gameId: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${gameId}`);
  }

  getBestMove(gameId: number): Observable<Move> {
    return this.http.get<Move>(`${this.apiUrl}/${gameId}/best-move`);
  }

  joinQueue(): Observable<QueueEvent> {
    return new Observable<QueueEvent>((observer) => {
      const onQueueMessageRecieved = (message: Message) => {
        const event = JSON.parse(message.body) as QueueEvent;
        if (event.type === 'MATCH_FOUND') {
          this.queueClient?.deactivate();
        }
        observer.next(event);
      };


      if (!this.queueClient?.active) {
        this.queueClient = new Client({
          brokerURL: this.wsUrl + '/queue',
          webSocketFactory: () => new SockJS(this.wsUrl + '/queue'),
          connectHeaders: {
            sessionID: this.userService.getSessionID()!,
            wsType: 'queue',
          },
          onConnect: () => {
            if (this.queueSubscription) {
              this.queueSubscription.unsubscribe(); // Unsubscribe from the previous subscription if it exists
            }
            this.queueSubscription = this.queueClient?.subscribe('/user/queue', (message: Message) => {
              onQueueMessageRecieved(message);
            });
          },
          onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
          },
        });

        this.queueClient.activate();
      }
    });
  }

  disconnectQueue(): void {
    if (this.queueClient !== null) {
      this.queueClient.deactivate();
    }
    if (this.queueSubscription) {
      this.queueSubscription.unsubscribe(); // Unsubscribe from the queue events
    }
  }

  // Safely joins a game only when the client is connected
  joinGame(gameId: number): Observable<GameEvent> {
    return new Observable<GameEvent>((observer) => {
      if (this.gameSubscriptions.has(gameId)) {
        // Already subscribed, just hook up the observer
        this.gameObservers.set(gameId, (event: GameEvent) => observer.next(event));
        return;
      }

      const subscribeToGame = () => {
        const destination = `/game/${gameId}`;
        const subscription = this.gameClient!.subscribe(destination, (message: Message) => {
          const event = JSON.parse(message.body) as GameEvent;
          this.gameObservers.get(gameId)?.(event);
        });

        this.gameSubscriptions.set(gameId, subscription);
        this.gameObservers.set(gameId, (event: GameEvent) => observer.next(event));
      };

      this.ensureClientConnected(subscribeToGame);
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
    if (this.gameSubscriptions.size === 0 && this.gameClient) {
      this.gameClient.deactivate();
      this.gameClient = null;
    }
  }

  pieceMoved(game: Game, move: Move): void {
    if (this.gameClient && this.gameClient.connected) {
      this.gameClient.publish({
        destination: `/app/game/${game.id}/move`,
        body: JSON.stringify(move),
      });
    }
  }

  resignGame(game: Game): void {
    if (this.gameClient && this.gameClient.connected) {
      this.gameClient.publish({
        destination: `/app/game/${game.id}/resign`
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

    if (this.gameClient) {
      this.gameClient.deactivate();
      this.gameClient = null;
    }
  }

  reconnectAll(): void {
    this.connectedGameSubscriptions.forEach(callback => this.pendingGameSubscriptions.push(callback));
    this.connectedGameSubscriptions = [];

    this.disconnectAll();
    
    this.ensureClientConnected();
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

    //check if is castling move
    if (move.length == 6) {
      const rookFromCol = move.charAt(5) === 's' ? 7 : 0; // King side or Queen side castling
      const rookToCol = move.charAt(5) === 's' ? 5 : 3; // King side or Queen side castling
      const rookFromRow = fromRow;
      const rookMove = this.convertToMove(rookFromCol, rookFromRow, rookToCol, toRow, board);

      //move rook from from cell to to cell
      this.movePieceOnBoard(board, rookMove.move);
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
  convertToMove(fromCol: number, fromRow: number, toCol: number, toRow: number, board: Field[][]): Move {
    let move: string = '';
    move += String.fromCharCode(fromCol + 'a'.charCodeAt(0)); // Convert column to letter
    move += (1 + fromRow).toString(); // Convert row to number
    move += String.fromCharCode(toCol + 'a'.charCodeAt(0)); // Convert column to letter
    move += (1 + toRow).toString(); // Convert row to number

    //if king moved, check if it was castled
    const piece = board[fromRow][fromCol].piece;
    if (piece && piece.type.toLowerCase() === 'k') {
      const kingMove = Math.abs(fromCol - toCol);
      if (kingMove === 2) {
        move += 'c'; // Castling move
        // add side
        if (toCol > fromCol) {
          move += 's'; // King side castling (short)
        } else {
          move += 'l'; // Queen side castling (long)
        }
      }
    }
    return {
      'move': move
    }
  }
}
