import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Field, Game, Move } from '../../../../interfaces/game';
import { BoardComponent } from "./board/board.component";
import { GameService } from '../../../../services/game/game.service';
import { MoveErrorEvent, MoveEvent } from '../../../../interfaces/websocket';
import { UserService } from '../../../../services/user/user.service';
import { PlayerComponent } from "./player/player.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MoveHistoryComponent } from "./move-history/move-history.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [BoardComponent, PlayerComponent, MatCheckboxModule, FormsModule, MoveHistoryComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  @Input() game!: Game;
  @Output() gameEnded: EventEmitter<void> = new EventEmitter<void>();

  board: Field[][] = [];
  labelPosition: 'inside' | 'outside' = 'inside'; // Default position for labels
  rotated: boolean = false; // Default rotation state

  gameSubscription: any;

  constructor(private gameService: GameService, private userService: UserService, private cdRef: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.board = this.gameService.movesToBoard(this.game.moves); // Convert the moves to a board representation

    this.gameService.joinGame(this.game.id).subscribe(event => {
      console.log(event); // Log the event received from the server
      if (event.type === 'GAME_MOVE') {
        this.applyMove(event.content as MoveEvent); // Apply the move to the game
      } else if (event.type === 'MOVE_ERROR') {
        this.handleMoveError(event.content as MoveErrorEvent); // Handle the move error
      } else if (event.type === 'GAME_ENDED') {
        this.gameEnded.emit(); // Emit the game ended event
        this.leaveGame(); // Leave the game when it ends
      }
    });

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.leaveGame(); // Leave the game when the component is destroyed
  }

  leaveGame(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    this.gameService.leaveGame(); // Disconnect from the game
  }

  movedPiece(move: Move): void {
    this.gameService.pieceMoved(this.game, move); // Move the piece in the game
    this.game.moves.push(move.move); // Add the move to the game moves
  }

  //move has zero-based move number
  applyMove(move: MoveEvent): void {
    //check if move number is either this last move
    if (move.moveNumber === this.game.moves.length - 1) {
    } else if (move.moveNumber === this.game.moves.length) {
      this.gameService.movePieceOnBoard(this.board, move.move);
      this.game.moves.push(move.move); // Add the move to the game moves
    } else {
      console.error('Invalid move number:', move.moveNumber); // Log an error if the move number is invalid
    }
  }

  //undos all moves until the move number
  handleMoveError(moveError: MoveErrorEvent): void {
    console.error('Handling move error:', moveError); // Log the move error
    this.undoMovesUntil(moveError.moveNumber); // Undo moves until the specified move number
  }

  //moveNumber is zero-based move number
  //moveNumber - 1 is last valid move
  undoMovesUntil(moveNumber: number): void {
    if (moveNumber <= this.game.moves.length) {
      this.game.moves = this.game.moves.slice(0, moveNumber); // Keep moves until the specified move number
      this.board = this.gameService.movesToBoard(this.game.moves); // Update the board with the remaining moves
    } else {
      console.error('Invalid move number:', moveNumber); // Log an error if the move number is invalid
    }
  }

  getPlayerColor(): 'white' | 'black' | null {
    const userId = this.userService.getCurrentUser()?.id; // Get the user ID from the user service
    if (userId === this.game.player1.id) {
      return 'white'; // Return 'white' if the user is the white player
    } else if (userId === this.game.player2.id) {
      return 'black'; // Return 'black' if the user is the black player
    }
    return null; // Return null if the user is not a player in the game
  }

  changeLabelPosition(isOutside: boolean) {
    this.labelPosition = isOutside ? 'outside' : 'inside'; // Change label position based on the checkbox
  }
}
