import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Field, Piece, PieceType } from '../../../../../../interfaces/game';
import { CommonModule } from '@angular/common';
import { HighlightComponent } from "../highlight/highlight.component";
import { fadeInOut } from 'src/app/animations/fade.animation';

@Component({
  selector: 'app-field',
  imports: [
    CommonModule,
    HighlightComponent
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  animations: [
    fadeInOut(200, 0.5)
  ]
})
export class FieldComponent implements OnInit {
  @Input() field: Field = { row: 0, column: 0, piece: null };
  @Output() clicked: EventEmitter<Field> = new EventEmitter<Field>();
  @ViewChild(HighlightComponent)
  highlight: HighlightComponent | null = null;

  row: number = 0;
  column: number = 0;
  piece: Piece | null = null;
  isWhite: boolean = false;

  ngOnInit(): void {
    this.row = this.field.row;
    this.column = this.field.column;
    this.piece = this.field.piece;

    this.isWhite = (this.row + this.column) % 2 === 1; // White fields are even sum of row and column indices
  }

  fieldClicked(): void {
    this.clicked.emit(this.field); // Emit the clicked event with the field data
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  showPromotionMenu(piece: Piece): Promise<Piece> {
    return new Promise((resolve, reject) => {
      if (this.highlight) {
        this.highlight.showPromotionMenu(piece).then((pieceType: PieceType) => {
          resolve({
            ...piece,
            'column': this.column,
            'row': this.row,
            'type': pieceType
          })
        }).catch(() => reject());
      } else {
        console.error("No highlight found");
      }
    });
  }
}
