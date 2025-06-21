import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Field, Game, GameEnd, GameNotFound, Move, Player } from '../../../../interfaces/game';
import { BoardComponent } from "./board/board.component";
import { GameService } from '../../../../services/game/game.service';
import { DrawOfferEvent, GameEndEvent, GameEvent, MoveErrorEvent, MoveEvent, PlayerJoinedEvent } from '../../../../interfaces/websocket';
import { UserService } from '../../../../services/user/user.service';
import { PlayerComponent } from "./player/player.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MoveHistoryComponent } from "./move-history/move-history.component";
import { CommonModule } from '@angular/common';
import { BehaviorSubject, fromEvent, map, Observable, startWith, Subscription } from 'rxjs';
import { User } from '../../../../interfaces/user';
import { Board3dComponent } from "./board3d/board3d.component";
import { LoadingButtonComponent } from "../../../../components/loading-button/loading-button.component";
import { IconComponent } from "../../../../icons/icon.component";
import { fadeInOut, slideLeftRight } from 'src/app/animations/fade.animation';
import { GameOverCardComponent } from "./game-over-card/game-over-card.component";
import { MatDialog } from '@angular/material/dialog';
import { openConfirmDialog } from 'src/app/components/dialogs/confirm/openConfirmdialog.helper';
import { MoveCalculator } from './board/move.calculator';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-game',
  imports: [BoardComponent, PlayerComponent, MatCheckboxModule, FormsModule, MoveHistoryComponent,
    CommonModule, Board3dComponent, LoadingButtonComponent, IconComponent, TranslateModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [
    fadeInOut(),
    slideLeftRight()
  ]
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() demo: boolean = false; // Flag to indicate if the game is in demo mode
  @Input() interactive: boolean = true; // Flag to control whether to display game component as interactive or not

  @Input() game!: Game | GameNotFound;
  gameEnsured: Game = {} as Game; // Ensure game is defined
  gameReady: boolean = false; // Flag to indicate if the game is ready

  @Output() gameEnded: EventEmitter<void> = new EventEmitter<void>();
  @Output() gameLoaded: EventEmitter<Game> = new EventEmitter<Game>();

  @ViewChild('upperSection')
  upperSection!: ElementRef<HTMLDivElement>;
  @ViewChild('lowerSection')
  lowerSection!: ElementRef<HTMLDivElement>;

  @ViewChild('nonInteractiveBoard')
  nonInteractiveBoard!: ElementRef<HTMLDivElement> | null;
  nonInsteractiveBoardObserver!: ResizeObserver; // Observer for non-interactive board

  observer!: ResizeObserver;

  threeD: boolean = false; // Default 3D state
  user$: Observable<User | null> = this.userService.user$; // Current user

  isPlaying: boolean = false; // Flag to indicate if the user is playing

  showNotFound: boolean = false; // Flag to show not found message

  board: Field[][] = [];
  labelPosition: 'inside' | 'outside' = 'inside'; // Default position for labels
  labelPositionOverride: 'inside' | 'outside' = this.labelPosition; // Override for label position
  showLabelPosition: boolean = true; // Flag to show label position
  rotated: boolean = false; // Default rotation state

  gameSubscription: Subscription | undefined; // Subscription to the game events

  bestMove: Move | null = null; // Best move suggestion
  loadingBestMove: boolean = false; // Loading state for best move

  loadingResignation: boolean = false; // Loading state for resignation
  resolveResignation: (() => void) | null = null; // Function to resolve resignation

  loadingDraw: boolean = false; // Loading state for draw
  loadingDrawCancel: boolean = false; // Loading state for cancel draw
  resolveDraw: (() => void) | null = null; // Function to resolve draw
  drawOffered: boolean = false; // Flag to indicate if a draw was offered by the opponent

  HEIGHT_THRESHOLD: number = 600;

  isHandset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(window.innerHeight < this.HEIGHT_THRESHOLD && window.innerWidth > this.HEIGHT_THRESHOLD);

  constructor(private el: ElementRef, private gameService: GameService, private userService: UserService, private cdRef: ChangeDetectorRef,
    private dialog: MatDialog, private router: Router, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    // check if game is of type GameNotFound by checking a distinguishing property
    if ('status' in this.game && (this.game as GameNotFound).status === 'not-found') {
      this.showNotFound = true; // Show not found message if the game is not found
      return; // Exit early if the game is not found
    }
    this.showNotFound = false; // Hide not found message if the game is found
    this.gameEnsured = this.game as Game; // Ensure game is of type Game
    this.board = this.gameService.movesToBoard(this.gameEnsured.moves.map(move => move.move)); // Convert the moves to a board representation

    const onEvent = (event: GameEvent) => {
      if (event.type === 'PLAYER_JOINED') {
        this.setGame(event.content as PlayerJoinedEvent); // Set the game when a player joins
      } else if (event.type === 'GAME_MOVE') {
        this.applyMove(event.content as MoveEvent); // Apply the move to the game
      } else if (event.type === 'MOVE_ERROR') {
        this.handleMoveError(event.content as MoveErrorEvent); // Handle the move error
      } else if (event.type === 'GAME_ENDED') {
        this.endGame(event.content as GameEndEvent); // Leave the game when it ends
      } else if (event.type === 'DRAW_OFFER') {
        this.drawOffer(event.content as DrawOfferEvent); // Handle draw offer
      }
    }
    const connect = () => {
      this.gameSubscription = this.gameService.joinGame(this.game.id).subscribe(onEvent);
    }
    if (!this.demo) {
      this.user$.subscribe(() => {
        this.isPlaying = this.getPlayerColor() !== null && !this.gameEnsured.result; // Set playing state if the user is a player in the game

        if (this.getPlayerColor() === 'black') {
          this.rotated = true; // Rotate the board if the player is black
        }

        if (this.gameSubscription) {
          //this.gameSubscription.unsubscribe(); // Unsubscribe from previous game events
          this.gameService.reconnectAll(); // Reconnect all game events with the new user
        } else {
          connect();
        }
      });
    }

    fromEvent(window, 'resize')
      .pipe(
        startWith(null), // Trigger on initial load
        map(() => {
          const targetWidth = window.innerHeight - 150;
          const isBelowThreshold = window.innerWidth < targetWidth;
          return isBelowThreshold;
        })
      )
      .subscribe(isBelowThreshold => {
        this.showLabelPosition = !isBelowThreshold; // Show label position if below threshold
      });

    fromEvent(window, 'resize')
      .pipe(
        startWith(null), // Emit on load,
        map(() => window.innerHeight < this.HEIGHT_THRESHOLD && window.innerWidth > this.HEIGHT_THRESHOLD), // Check if the window is below the threshold
      )
      .subscribe(value => {
        this.isHandset$.next(value);
      });

    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    if (this.interactive) {
      this.observer = new ResizeObserver((entries) => {
        for (const _ of entries) {
          this.el.nativeElement.style.setProperty('--top-section-height', `${this.upperSection.nativeElement.clientHeight}px`);
          this.el.nativeElement.style.setProperty('--bottom-section-height', `${this.lowerSection.nativeElement.clientHeight}px`);
        }
      });
      this.observer.observe(this.upperSection.nativeElement); // Observe the upper section for size changes
      this.observer.observe(this.lowerSection.nativeElement); // Observe the lower section for size changes
    } else if (this.nonInteractiveBoard) {
      this.nonInsteractiveBoardObserver = new ResizeObserver(() => {
        if (this.nonInteractiveBoard) {
          this.nonInteractiveBoard.nativeElement.style.setProperty('--board-height', `${Math.min(
            this.nonInteractiveBoard.nativeElement.clientHeight,
            this.nonInteractiveBoard.nativeElement.clientWidth
          )}px`);
        }
      });
      this.nonInsteractiveBoardObserver.observe(this.nonInteractiveBoard.nativeElement); // Observe the non-interactive board for size changes
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game']) {
      if ((changes['game'].currentValue as Game).id !== (changes['game'].previousValue as Game)?.id && (changes['game'].previousValue as Game)?.id !== this.game.id) {
        this.disconnect(); // Disconnect from the previous game if the game ID has changed
        this.ngOnInit(); // Reinitialize the component with the new game
        this.ngAfterViewInit(); // Reinitialize the view after changes
      }
    }
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
    if (this.gameEnsured.result) {
      this.gameEnsured.player1.inCheck = false; // Reset check state for player 1
      this.gameEnsured.player2.inCheck = false; // Reset check state for player 2
      if (this.gameEnsured.result === '1-0') {
        this.gameEnsured.player1.isCheckmate = false; // Set checkmate state for player 1
        this.gameEnsured.player2.isCheckmate = true; // Set checkmate state for player 2
      } else if (this.gameEnsured.result === '0-1') {
        this.gameEnsured.player1.isCheckmate = true; // Set checkmate state for player 1
        this.gameEnsured.player2.isCheckmate = false; // Set checkmate state for player 2
      }
    } else {
      this.gameEnsured.player1.inCheck = MoveCalculator.isKingInCheck(this.board, true); // Update check state for player 1
      this.gameEnsured.player2.inCheck = MoveCalculator.isKingInCheck(this.board, false); // Update check state for player 2
    }
  }

  setGame(game: PlayerJoinedEvent): void {
    this.gameEnsured = game.gameState; // Set the game
    this.gameLoaded.emit(this.gameEnsured); // Emit the game loaded event
    this.board = this.gameService.movesToBoard(this.gameEnsured.moves.map(move => move.move)); // Convert the moves to a board representation

    if (this.gameEnsured.result) {
      this.isPlaying = false; // Set playing state to false if the game has ended
    }

    if (this.gameEnsured.drawOffer) {
      this.drawOffer(this.gameEnsured.drawOffer); // Handle draw offer if available
    }

    this.reloadCheck(); // Ensure check state is updated

    this.gameReady = true; // Set game ready state
  }

  endGame(gameEnd: GameEndEvent | null = null): void {
    this.loadingDraw = false; // Reset loading state for draw
    this.loadingDrawCancel = false; // Reset loading state for cancel draw
    this.resolveResignation?.();
    this.resolveDraw?.();
    this.gameEnded.emit(); // Emit the game ended event
    if (gameEnd) {
      this.isPlaying = false; // Set playing state to false
      this.gameEnsured.result = gameEnd.winner ? (gameEnd.winner?.id === this.gameEnsured.player1.id ? '1-0' : '0-1') : '1/2'; // Set the game result
      if (gameEnd?.move && gameEnd?.moveNumber) {
        this.applyMove({ 'move': gameEnd.move, 'moveNumber': gameEnd.moveNumber }); // Apply the last move if available
      } else {
        this.reloadCheck(); // Ensure check state is updated
      }

      const dialogData: GameEnd = {
        player1: this.gameEnsured.player1,
        player2: this.gameEnsured.player2,
        result: this.gameEnsured.result!
      }
      this.dialog.open(GameOverCardComponent, {
        'data': dialogData
      });
    }
    this.disconnect(); // Disconnect from the game
  }

  resign(): void {
    if (!this.gameReady) {
      return;
    }
    openConfirmDialog(
      this.dialog,
      this.translateService,
      'GAME.RESIGN.RESIGN',
      ['GAME.RESIGN.CONFIRMATION',
        'GAME.RESIGN.WARNING'
      ],
      'GAME.RESIGN.RESIGN',
      () => {
        this.gameService.resignGame(this.gameEnsured); // Resign from the game
        this.loadingResignation = true; // Set loading state for resignation
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

  offerDraw(): void {
    if (!this.gameReady) {
      return;
    }
    openConfirmDialog(
      this.dialog,
      this.translateService,
      this.drawOffered ? 'GAME.DRAW.ACCEPT' : 'GAME.DRAW.OFFER',
      [
        this.drawOffered ? 'GAME.DRAW.ACCEPT_CONFIRMATION' : 'GAME.DRAW.OFFER_CONFIRMATION',
        this.drawOffered ? 'GAME.DRAW.ACCEPT_WARNING' : 'GAME.DRAW.OFFER_WARNING'
      ],
      this.drawOffered ? 'GAME.DRAW.ACCEPT' : 'GAME.DRAW.OFFER',
      () => {
        this.loadingDraw = true; // Set loading state for draw
        this.gameService.draw(this.gameEnsured); // Offer a draw in the game
        //return observable that resolves when the game is drawn
        return new Observable<void>((observer) => {
          this.resolveDraw = () => {
            observer.next(); // Notify that the draw is resolved
            observer.complete(); // Complete the observable
          };
        });
      }
    );
  }

  cancelDraw(): void {
    if (!this.gameReady) {
      return;
    }
    this.loadingDrawCancel = true; // Set loading state for cancel draw
    this.gameService.cancelDraw(this.gameEnsured); // Cancel the draw offer
  }

  drawOffer(drawOffer: DrawOfferEvent): void {
    this.loadingDrawCancel = false; // Reset loading state for cancel draw
    if (drawOffer.type === 'OFFERED') {
      // Check if the draw offer is from the opponent
      if (this.getPlayerColor() === 'white' && this.gameEnsured.player2.id === drawOffer.initiatorID ||
        this.getPlayerColor() === 'black' && this.gameEnsured.player1.id === drawOffer.initiatorID) {
        this.drawOffered = true; // Set draw offered state
      } else {
        this.loadingDraw = true; // Set loading state for draw
      }
      this.resolveDraw?.(); // Resolve the draw offer if available
    } else if (drawOffer.type === 'REJECTED') {
      this.drawOffered = false; // Reset draw offered state
      this.loadingDraw = false; // Reset loading state for draw
    }
  }

  movedPiece(move: Move): void {
    this.gameService.pieceMoved(this.gameEnsured, move); // Move the piece in the game
    this.applyMove({ 'move': move.move, 'moveNumber': this.gameEnsured.moves.length }); // Apply the move
  }

  //move has zero-based move number
  applyMove(move: MoveEvent): void {
    this.loadingBestMove = false; // Reset loading state for best move
    this.bestMove = null; // Reset best move suggestion
    //check if move number is either this last move
    if (move.moveNumber === this.gameEnsured.moves.length - 1) {
    } else if (move.moveNumber === this.gameEnsured.moves.length) {
      this.gameEnsured = {
        ...this.gameEnsured, // Spread the existing game state
        moves: [...this.gameEnsured.moves, move] // Add the new move to the game moves
      };
      this.board = this.gameService.movesToBoard(this.gameEnsured.moves.map(move => move.move)); // Update the board with the new move

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
    if (moveNumber < this.gameEnsured.moves.length) {
      this.gameEnsured.moves = this.gameEnsured.moves.slice(0, moveNumber); // Keep moves until the specified move number
      this.board = this.gameService.movesToBoard(this.gameEnsured.moves.map(move => move.move)); // Update the board with the remaining moves
    } else {
      console.error('Invalid move number:', moveNumber); // Log an error if the move number is invalid
    }
  }

  getPlayerColor(): 'white' | 'black' | null {
    const userId = this.userService.getCurrentUser()?.id; // Get the user ID from the user service
    if (userId === this.gameEnsured.player1.id) {
      return 'white'; // Return 'white' if the user is the white player
    } else if (userId === this.gameEnsured.player2.id) {
      return 'black'; // Return 'black' if the user is the black player
    }
    return null; // Return null if the user is not a player in the game
  }

  changeLabelPosition(isOutside: boolean) {
    this.labelPosition = isOutside ? 'outside' : 'inside'; // Change label position based on the checkbox
  }

  getLabelPosition(): 'inside' | 'outside' {
    if (this.showLabelPosition && !this.isHandset$.getValue()) {
      return this.labelPosition; // Return the label position if it is shown
    }
    return this.labelPositionOverride; // Return the overridden label position if not shown
  }

  getPlayerTurn(): Player | null {
    if (this.gameEnsured.result === null) {
      return this.gameEnsured.moves.length % 2 === 0 ? this.gameEnsured.player1 : this.gameEnsured.player2; // Determine the player turn based on the number of moves
    }
    return null; // Return null if no player is found
  }

  getBestMove(): void {
    this.loadingBestMove = true; // Set loading state for best move
    this.gameService.getBestMove(this.gameEnsured.id).subscribe((move: Move) => {
      this.bestMove = move; // Set the best move suggestion
      this.loadingBestMove = false; // Reset loading state for best move
    }, () => {
      this.loadingBestMove = false; // Reset loading state for best move on error
    });
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the play page
  }

  mapMoves(moves: Move[]): string[] {
    return moves.map(move => move.move); // Map the moves to their string representation
  }
}
