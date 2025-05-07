import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Field, Game, Move, Piece } from '../../interfaces/game';
import { Client, Message } from '@stomp/stompjs';
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

  constructor(private http: HttpClient, private userService: UserService) { }

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
            this.client?.subscribe('/user/queue', (message: Message) => {
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
  }

  joinGame(gameId: number): Observable<GameEvent> {
    return new Observable<GameEvent>((observer) => {
      const onGameMessageRecieved = (message: Message) => {
        const event = JSON.parse(message.body) as GameEvent;
        observer.next(event);
      };

      if (!this.client?.active) {
        this.client = new Client({
          brokerURL: this.apiUrl + '/game',
          webSocketFactory: () => new SockJS(this.apiUrl + '/game'),
          connectHeaders: {
            sessionID: this.userService.getSessionID()!,
            wsType: 'game',
          },
          onConnect: () => {
            this.client?.subscribe('/game/' + gameId, (message: Message) => {
              onGameMessageRecieved(message);
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

  leaveGame(): void {
    if (this.client !== null) {
      this.client.deactivate();
    }
  }

  pieceMoved(game: Game, move: Move): void {
    if (this.client !== null) {
      this.client.publish({
        destination: '/app/game/' + game.id + '/move',
        body: JSON.stringify(move),
      });
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
