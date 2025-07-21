import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Field, Game, Move, Piece } from '../../../../../interfaces/game';
import { GameService } from '../../../../../services/game/game.service';
import { getInitialBoard, pieceMapping } from '../../../../../constants/chess.constants';
import { MoveCalculator } from '../board/move.calculator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from "../../../../../icons/icon.component";

@Component({
  selector: 'app-move-history',
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule,
    IconComponent
  ],
  templateUrl: './move-history.component.html',
  styleUrl: './move-history.component.scss'
})
export class MoveHistoryComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() game: Game = {} as Game;
  @Input() stacked: boolean = false;
  @Input() activeMoveNumber: number = 0;
  @Output() moveHistoryClicked = new EventEmitter<number>();

  @ViewChildren('moveBtn', { read: ElementRef })
  private moveBtns!: QueryList<ElementRef<HTMLButtonElement>>;

  moveHistory: Move[] = [];

  constructor(private gameService: GameService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {


    // add event listeners for arrow keys
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy(): void {
    // remove event listeners for arrow keys
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (event.ctrlKey) {
        this.moveFirst();
      } else {
        this.moveBackward();
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (event.ctrlKey) {
        this.moveLast();
      } else {
        this.moveForward();
      }
    }
  }

  ngAfterViewInit(): void {
    this.setMoveHistory();
    this.scrollActiveIntoView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game'] && !changes['game'].firstChange) {
      this.setMoveHistory();
    }
    if (changes['activeMoveNumber'] && !changes['activeMoveNumber'].firstChange) {
      this.scrollActiveIntoView();
    }
  }

  setMoveHistory(): void {
    this.moveHistory = []; // Reset move history
    let board: Field[][] = getInitialBoard();
    let enPassantField: Field | null = null;
    if (this.game.moves) {
      for (let i = 0; i < this.game.moves.length; i++) {
        const move: Move = this.game.moves[i];
        this.moveHistory.push({ ...move, stringRepresentation: this.getMove(move.move, board, enPassantField) });
        [board, enPassantField] = this.gameService.movesToBoard([move.move], board);
      }
    }

    this.cdRef.detectChanges(); // Ensure the view is updated after changes
  }

  getMove(move: string, board: Field[][], enPassantField: Field | null): string {
    // Account for castling
    if (move.length === 6 && move.charAt(4) === 'c') {
      if (move.charAt(5) === 's') {
        return 'O-O';
      }
      if (move.charAt(5) === 'l') {
        return 'O-O-O';
      }
    }
    const { fromCol, fromRow, toCol, toRow } = this.gameService.convertFromMove(move);
    const piece: Piece = board[fromRow][fromCol].piece!;
    const isWhite = piece.isWhite;
    const boardCopy: Field[][] = this.gameService.movesToBoard([move], JSON.parse(JSON.stringify(board)))[0];
    const isCheck = MoveCalculator.isKingInCheck(boardCopy, !isWhite)[0] ? '+' : '';
    const pieceName: string = pieceMapping[piece.type];

    let rank = '';
    let row = '';

    const piecesFound = this.gameService.findPieceType(board, piece.type);
    if (piecesFound.length > 0) {
      // Only check for other pieces if there are multiple of the same type
      piecesFound.filter(p => p.id !== piece.id).forEach(p => {
        if (MoveCalculator.isValidMove(p, board[toRow][toCol], board, enPassantField)) {
          // if there are multiple pieces of the same type that can move to the same square, we need to indicate which piece is moving
          if (p.column === fromCol) {
            row = String.fromCharCode(piece.row + '1'.charCodeAt(0));
          }
          if (p.row === fromRow) {
            rank = String.fromCharCode(piece.column + 'a'.charCodeAt(0));
          }
        }
      });
    }

    let promotionPiece = '';
    if (move.length === 5) {
      promotionPiece = `⇒${pieceMapping[move.charAt(4)]}`; // Promotion piece
    }

    let pieceCaptured: string = board[toRow][toCol].piece ? 'x' : '';

    if (piece.type.toLowerCase() === 'p' && enPassantField && enPassantField.column === toCol && enPassantField.row === toRow) {
      // handle en passant
      pieceCaptured = 'x';
    }

    if (piece.type.toLowerCase() === 'p' && pieceCaptured === 'x') {
      // indicate rank on pawn move
      rank = String.fromCharCode(fromCol + 'a'.charCodeAt(0));
    }

    const from = move.charAt(0) + move.charAt(1);
    const to = move.charAt(2) + move.charAt(3);

    const moveString: string = `${pieceName}${rank}${row}${pieceCaptured}${to}${promotionPiece}${isCheck}`;
    return moveString;
  }

  get movePairs(): Move[][] {
    const pairs: Move[][] = [];
    const dummyHistory: Move[] = this.moveHistory;
    for (let i = 0; i < dummyHistory.length; i += 2) {
      pairs.push(dummyHistory.slice(i, i + 2));
    }
    return pairs;
  }

  trackByMove(_: number, movePair: Move[]): string {
    return movePair.map(move => move.move).join('-'); // Use the move pair as a unique identifier
  }

  moveForward(): void {
    if (this.activeMoveNumber < this.game.moves.length - 1) {
      this.moveHistoryClicked.emit(this.activeMoveNumber + 1);
    }
  }

  moveBackward(): void {
    if (this.activeMoveNumber > -1) {
      this.moveHistoryClicked.emit(this.activeMoveNumber - 1);
    }
  }

  moveFirst(): void {
    if (this.activeMoveNumber > -1) {
      this.moveHistoryClicked.emit(-1);
    }
  }

  moveLast(): void {
    if (this.activeMoveNumber < this.game.moves.length - 1) {
      this.moveHistoryClicked.emit(this.game.moves.length - 1);
    }
  }

  private scrollActiveIntoView(): void {
    const actualNumber = Math.max(this.activeMoveNumber, 0); // ensure we scroll to the correct button
    const el = this.moveBtns.get(actualNumber)?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  formattedTime(timeMs: number): string {
    const secondsLeft = timeMs / 100;
    // Format the time left in mm:ss format
    const minutes = Math.floor(secondsLeft / 600);
    const seconds = Math.floor(secondsLeft % 600) / 10;
    return `${minutes > 0 ? minutes.toString() + 'm,' : ''}${seconds.toFixed(1)}s`;
  }
}