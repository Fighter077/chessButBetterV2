import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Field, Game, GameEnd, Move, Player } from '../../../../interfaces/game';
import { BoardComponent } from "./board/board.component";
import { GameService } from '../../../../services/game/game.service';
import { GameEndEvent, MoveErrorEvent, MoveEvent } from '../../../../interfaces/websocket';
import { UserService } from '../../../../services/user/user.service';
import { PlayerComponent } from "./player/player.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MoveHistoryComponent } from "./move-history/move-history.component";
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../../../interfaces/user';
import { Board3dComponent } from "./board3d/board3d.component";
import { LoadingButtonComponent } from "../../../../components/loading-button/loading-button.component";
import { IconComponent } from "../../../../icons/icon.component";
import { fadeInOut } from 'src/app/animations/fade.animation';
import { GameOverCardComponent } from "./game-over-card/game-over-card.component";
import { MatDialog } from '@angular/material/dialog';
import { openConfirmDialog } from 'src/app/components/dialogs/confirm/openConfirmdialog.helper';
import { MoveCalculator } from './board/move.calculator';

@Component({
  selector: 'app-game',
  imports: [BoardComponent, PlayerComponent, MatCheckboxModule, FormsModule, MoveHistoryComponent, CommonModule, Board3dComponent, LoadingButtonComponent, IconComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [fadeInOut()]
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() game!: Game;
  @Output() gameEnded: EventEmitter<void> = new EventEmitter<void>();
  @Output() gameLoaded: EventEmitter<Game> = new EventEmitter<Game>();

  @ViewChild('upperSection')
  upperSection!: ElementRef<HTMLDivElement>;
  @ViewChild('lowerSection')
  lowerSection!: ElementRef<HTMLDivElement>;
  observer: ResizeObserver;

  threeD: boolean = false; // Default 3D state
  user: User | null = null; // Current user

  isPlaying: boolean = false; // Flag to indicate if the user is playing

  board: Field[][] = [];
  labelPosition: 'inside' | 'outside' = 'inside'; // Default position for labels
  rotated: boolean = false; // Default rotation state

  gameSubscription: Subscription | undefined; // Subscription to the game events

  loadingResignation: boolean = false; // Loading state for resignation
  resolveResignation: (() => void) | null = null; // Function to resolve resignation

  constructor(private el: ElementRef, private gameService: GameService, private userService: UserService, private cdRef: ChangeDetectorRef, private dialog: MatDialog) {
    this.user = this.userService.getCurrentUser(); // Get the current user from the user service

    this.observer = new ResizeObserver((entries) => {
      for (const _ of entries) {
        this.el.nativeElement.style.setProperty('--top-section-height', `${this.upperSection.nativeElement.clientHeight}px`);
        this.el.nativeElement.style.setProperty('--bottom-section-height', `${this.lowerSection.nativeElement.clientHeight}px`);
      }
    });
  }

  ngOnInit(): void {
    this.board = this.gameService.movesToBoard(this.game.moves); // Convert the moves to a board representation

    this.gameSubscription = this.gameService.joinGame(this.game.id).subscribe(event => {
      if (event.type === 'PLAYER_JOINED') {
        this.gameLoaded.emit(this.game); // Emit the game loaded event
        this.reloadCheck(); // Update check state
        this.isPlaying = this.getPlayerColor() !== null && !this.game.result; // Set playing state if the user is a player in the game
      } else if (event.type === 'GAME_MOVE') {
        this.applyMove(event.content as MoveEvent); // Apply the move to the game
      } else if (event.type === 'MOVE_ERROR') {
        this.handleMoveError(event.content as MoveErrorEvent); // Handle the move error
      } else if (event.type === 'GAME_ENDED') {
        this.endGame(event.content as GameEndEvent); // Leave the game when it ends
      }
    });

    if (this.getPlayerColor() === 'black') {
      this.rotated = true; // Rotate the board if the player is black
    }

    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.observer.observe(this.upperSection.nativeElement); // Observe the upper section for size changes
    this.observer.observe(this.lowerSection.nativeElement); // Observe the lower section for size changes
  }


  ngOnDestroy(): void {
    this.disconnect(); // Leave the game when the component is destroyed
  }

  disconnect(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    this.gameService.leaveGame(this.game.id); // Disconnect from the game
  }

  reloadCheck(): void {
    if (this.game.result) {
      this.game.player1.inCheck = false; // Reset check state for player 1
      this.game.player2.inCheck = false; // Reset check state for player 2
      if (this.game.result === '1-0') {
        this.game.player1.isCheckmate = false; // Set checkmate state for player 1
        this.game.player2.isCheckmate = true; // Set checkmate state for player 2
      } else if (this.game.result === '0-1') {
        this.game.player1.isCheckmate = true; // Set checkmate state for player 1
        this.game.player2.isCheckmate = false; // Set checkmate state for player 2
      }
    } else {
      this.game.player1.inCheck = MoveCalculator.isKingInCheck(this.board, true); // Update check state for player 1
      this.game.player2.inCheck = MoveCalculator.isKingInCheck(this.board, false); // Update check state for player 2
    }
  }


  endGame(gameEnd: GameEndEvent | null = null): void {
    this.resolveResignation?.();
    this.gameEnded.emit(); // Emit the game ended event
    if (gameEnd) {
      this.isPlaying = false; // Set playing state to false
      this.game.result = gameEnd.winner ? (gameEnd.winner?.id === this.game.player1.id ? '1-0' : '0-1') : '1/2'; // Set the game result
      if (gameEnd?.move && gameEnd?.moveNumber) {
        this.applyMove({ 'move': gameEnd.move, 'moveNumber': gameEnd.moveNumber }); // Apply the last move if available
      } else {
        this.reloadCheck(); // Ensure check state is updated
      }

      const dialogData: GameEnd = {
        player1: this.game.player1,
        player2: this.game.player2,
        result: this.game.result
      }
      this.dialog.open(GameOverCardComponent, {
        'data': dialogData
      });
    }
    this.disconnect(); // Disconnect from the game
  }

  resign(): void {
    openConfirmDialog(
      this.dialog,
      'Resign',
      ['Are you sure you want to resign?',
        'The game will be ended and you will lose.'
      ],
      'Resign',
      () => {
        this.gameService.resignGame(this.game); // Resign from the game
        //return observable that resolves when the game is resigned
        return new Observable<void>((observer) => {
          this.resolveResignation = () => {
            this.loadingResignation = false; // Reset loading state for resignation
            observer.next(); // Notify that the resignation is resolved
            observer.complete(); // Complete the observable
          };
        });
      }
    );
  }

  movedPiece(move: Move): void {
    this.gameService.pieceMoved(this.game, move); // Move the piece in the game
    this.applyMove({ 'move': move.move, 'moveNumber': this.game.moves.length }); // Apply the move
  }

  //move has zero-based move number
  applyMove(move: MoveEvent): void {
    //check if move number is either this last move
    if (move.moveNumber === this.game.moves.length - 1) {
    } else if (move.moveNumber === this.game.moves.length) {
      this.gameService.movePieceOnBoard(this.board, move.move);
      this.game.moves.push(move.move); // Add the move to the game moves

      // Update check state of the players
      this.reloadCheck();
    } else {
      console.error('Invalid move number:', move.moveNumber); // Log an error if the move number is invalid
    }
  }

  //undos all moves until the move number
  handleMoveError(moveError: MoveErrorEvent): void {
    this.undoMovesUntil(moveError.moveNumber); // Undo moves until the specified move number
  }

  //moveNumber is zero-based move number
  //moveNumber - 1 is last valid move
  undoMovesUntil(moveNumber: number): void {
    if (moveNumber < this.game.moves.length) {
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

  getPlayerTurn(): Player | null {
    if (this.game.result === null) {
      return this.game.moves.length % 2 === 0 ? this.game.player1 : this.game.player2; // Determine the player turn based on the number of moves
    }
    return null; // Return null if no player is found
  }
}
