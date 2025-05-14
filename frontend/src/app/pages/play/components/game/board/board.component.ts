import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldComponent } from "./field/field.component";
import { CommonModule } from '@angular/common';
import { Field, Move, Piece } from '../../../../../interfaces/game';
import { PieceComponent } from "./piece/piece.component";
import { GameService } from '../../../../../services/game/game.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MoveCalculator } from './move.calculator';

@Component({
  selector: 'app-board',
  imports: [
    CommonModule,
    FieldComponent,
    PieceComponent,
    MatCheckboxModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, DoCheck {
  @Input() board: Field[][] = [];
  @Input() playerColor: 'white' | 'black' | null = null; // Default player color
  @Output() movedPiece = new EventEmitter<Move>();

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

  ngDoCheck() {
    this.syncPieces(); // Sync pieces on every change detection cycle
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
  }

  pieceClicked(piece: Piece) {
    this.unHighlightFields(); // Unhighlight all fields before selecting a new piece
    if (this.selectedPiece) {
      this.selectedPiece.selected = false;

      // If the clicked piece is oppenent's piece, click underlying field
      if (this.selectedPiece.isWhite !== piece.isWhite) {
        this.fieldClicked(this.board[piece.row][piece.column]); // Click the field of the opponent's piece
        return;
      }
    }
    this.selectedPiece = piece;
    this.selectedPiece.selected = true;
    this.highLightFields(); // Highlight possible moves for the selected piece
  }

  fieldClicked(field: Field) {
    // Handle field click event here
    if (this.selectedPiece) {
      this.movedPiece.emit(this.gameService.convertToMove(this.selectedPiece.column, this.selectedPiece.row, field.column, field.row)); // Emit the move event
      this.gameService.movePieceOnBoard(this.board, this.gameService.convertToMove(this.selectedPiece.column, this.selectedPiece.row, field.column, field.row).move); // Move the piece on the board
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
    if (this.selectedPiece) {
      MoveCalculator.getPossibleMoves(this.selectedPiece, this.board, true).forEach((move: Field) => {
        const field = this.board[move.row][move.column]; // Get the field from the board
        field.isHighlighted = true; // Highlight the field
        if (field.piece) {
          field.piece.couldBeCaptured = true; // Highlight the piece if it exists
        }
      });
    }
  }
}
