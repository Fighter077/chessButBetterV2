import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Field, Piece } from '../../../../../../interfaces/game';
import { CommonModule } from '@angular/common';
import { HighlightComponent } from "../highlight/highlight.component";

@Component({
  selector: 'app-field',
  imports: [
    CommonModule,
    HighlightComponent
],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent implements OnInit {
  @Input() field: Field = { row: 0, column: 0, piece: null };
  @Output() clicked: EventEmitter<Field> = new EventEmitter<Field>();

  row: number = 0;
  column: number = 0;
  piece: Piece | null = null;
  isWhite: boolean = false;

  ngOnInit() {
    this.row = this.field.row;
    this.column = this.field.column;
    this.piece = this.field.piece;

    this.isWhite = (this.row + this.column) % 2 === 0; // White fields are even sum of row and column indices
  }

  fieldClicked() {
    this.clicked.emit(this.field); // Emit the clicked event with the field data
  }
}
