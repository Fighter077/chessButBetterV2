import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FieldComponent } from "./field/field.component";
import { CommonModule } from '@angular/common';
import { Field, Move, Piece } from '../../../../../interfaces/game';
import { PieceComponent } from "./piece/piece.component";
import { GameService } from '../../../../../services/game/game.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MoveCalculator } from './move.calculator';
import { HighlightMoveComponent } from "./highlight-move/highlight-move.component";

@Component({
  selector: 'app-board',
  imports: [
    CommonModule,
    FieldComponent,
    PieceComponent,
    MatCheckboxModule,
    HighlightMoveComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() whiteIsChecked: boolean | null = null; // Default value for checked player
  @Input() piecesGivingCheck: Piece[] = []; // List of pieces giving check
  @Input() interactive: boolean = true; // Flag to indicate if the board is interactive
  @Input() board: Field[][] = [];
  @Input() moves: string[] = []; // List of moves
  @Input() playerColor: 'white' | 'black' | null = null; // Default player color
  @Input() isPlaying: boolean = false; // Flag to indicate if the user is playing
  @Input() isTurn: boolean = false; // Flag to indicate if it's the user's turn
  @Output() movedPiece = new EventEmitter<Move>();
  @Input() bestMove: Move | null = null; // Best move for the AI

  @Input() enPassantField: Field | null = null; // Field for en passant capture

  @ViewChildren(FieldComponent)
  private fields!: QueryList<FieldComponent>;

  @Input() rotated: boolean = false; // Default rotation state

  @Input() labelPosition: 'inside' | 'outside' = 'inside'; // Default position for labels

  rowLabels: string[] = []; // [1, 2, 3, 4, 5, 6, 7, 8]
  columnLabels: string[] = [];  // ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  pieces: Piece[] = [];
  selectedPiece: Piece | null = null;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.pieces = this.board.flatMap((row) => row.map((field) => field.piece)).filter((piece) => piece !== null) as Piece[];
    this.rowLabels = this.board.map((_, index) => (1 + index).toString());
    this.columnLabels = this.board.length > 0 ? this.board[0].map((_, index) => String.fromCharCode(65 + index)) : [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['board'] && !changes['board'].firstChange) {
      this.syncPieces(); // Sync pieces when the board changes
    }
  }

  syncPieces() {
    const newPieces = this.board
      .flatMap(row => row.map(field => field.piece))
      .filter((piece): piece is Piece => piece !== null);

    const newSet = new Set(newPieces);

    // Update positions and filter out removed pieces
    this.pieces = this.pieces
      .filter(piece => newSet.has(piece))
      .map(piece => {
        const updated = newPieces.find(p => p === piece)!;
        piece.row = updated.row;
        piece.column = updated.column;
        return piece;
      });

    // Add new pieces
    newPieces.forEach(piece => {
      if (!this.pieces.includes(piece)) {
        this.pieces.push(piece);
      }
    });

    if (this.selectedPiece) {
      //Check if the selected piece still exists in the new pieces array
      const foundPiece = this.pieces.find(piece => piece === this.selectedPiece);
      if (!foundPiece) {
        this.selectedPiece = null; // Deselect the piece if it no longer exists
      }
      // Reload highlighted fields
      this.unHighlightFields();
      this.highLightFields();

    }
  }

  pieceClicked(piece: Piece) {
    if (this.selectedPiece) {
      this.selectedPiece.selected = false;
      if (this.selectedPiece.column === piece.column && this.selectedPiece.row === piece.row) {
        this.selectedPiece = null; // Deselect the piece
        this.unHighlightFields(); // Unhighlight all fields if the same piece is clicked again
        return;
      }

      // If the clicked piece is oppenent's piece, click underlying field
      if (this.selectedPiece.isWhite !== piece.isWhite && this.isPlaying && this.isTurn) {
        this.fieldClicked(this.board[piece.row][piece.column]); // Click the field of the opponent's piece
        return;
      }
    }
    this.selectedPiece = piece;
    this.selectedPiece.selected = true;
    this.unHighlightFields(); // Unhighlight all fields before selecting a new piece
    this.highLightFields(); // Highlight possible moves for the selected piece
  }

  async fieldClicked(field: Field) {
    // Handle field click event here
    if (this.selectedPiece) {
      if (this.isPlaying && this.isTurn && (this.selectedPiece.isWhite === (this.playerColor === 'white')) && field.isHighlighted) {
        // check if move is promotion
        let promotionPiece: Piece | null = null;
        if (
          (this.selectedPiece.type === 'P' && field.row === 7) ||
          (this.selectedPiece.type === 'p' && field.row === 0)
        ) {
          const fieldComponent = this.getFieldComponent(field);
          try {
            const result = await fieldComponent?.showPromotionMenu(this.selectedPiece);
            promotionPiece = result === undefined ? null : result;
          } catch (error) {
            console.error('Error showing promotion menu:', error);
            return; // Exit if the promotion menu was closed without selection
          }
        }
        const convertedMove: Move = this.gameService.convertToMove(this.selectedPiece.column, this.selectedPiece.row, field.column, field.row, this.board, promotionPiece);
        console.log('Converted Move:', convertedMove);
        this.movedPiece.emit(convertedMove); // Emit the move event
      }
      this.selectedPiece.selected = false; // Deselect the piece after moving
    }
    this.unHighlightFields(); // Unhighlight all fields after moving
    this.selectedPiece = null; // Deselect the piece after moving
  }

  unHighlightFields() {
    this.board.forEach((row) => {
      row.forEach((field) => {
        field.isHighlighted = false; // Unhighlight all fields
        if (field.piece) {
          field.piece.couldBeCaptured = false; // Unhighlight all pieces
        }
      });
    });
  }

  highLightFields() {
    const all = this.selectedPiece?.isWhite === (this.playerColor !== 'white');
    if (this.selectedPiece) {
      MoveCalculator.getPossibleMoves(this.selectedPiece, this.board, this.moves, this.enPassantField, !this.isTurn || all).forEach((move: Field) => {
        const field = this.board[move.row][move.column]; // Get the field from the board
        field.isHighlighted = true; // Highlight the field
        if (field.piece) {
          field.piece.couldBeCaptured = true; // Highlight the piece if it exists
        }
      });
    }
  }

  trackByRowIndex(index: number, row: Field[]): number {
    return index; // Use the index as the unique identifier for rows
  }

  trackByColIndex(index: number, field: Field): number {
    return index; // Use the index as the unique identifier for fields
  }

  trackByPieceIndex(index: number, piece: Piece): string {
    return `${piece.id}`; // Use a combination of type, row, and column as a unique identifier for pieces
  }

  getFieldComponent(field: Field): FieldComponent | null {
    return this.fields.find(current => current.column === field.column && current.row === field.row) || null;
  }

  getInCheckStatus(piece: Piece): boolean {
    if (piece.type === 'K' || piece.type === 'k') {
      return piece.isWhite ? this.whiteIsChecked === true : this.whiteIsChecked === false;
    }
    return false; // Only kings can be in check, so return false for other pieces
  }

  getGivesCheckStatus(piece: Piece): boolean {
    return this.piecesGivingCheck.some(p => p.id === piece.id);
  }
}