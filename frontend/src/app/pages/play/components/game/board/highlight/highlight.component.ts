import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { Piece, PieceType } from 'src/app/interfaces/game';
import { PieceComponent } from "../piece/piece.component";

@Component({
  selector: 'app-highlight',
  imports: [
    MatMenuModule,
    MatButtonModule,
    PieceComponent
  ],
  templateUrl: './highlight.component.html',
  styleUrl: './highlight.component.scss'
})
export class HighlightComponent {
  @ViewChild(MatMenuTrigger)
  promotionSelectorTrigger!: MatMenuTrigger;

  resolve: ((value: PieceType) => void) | null = null;

  promitionOptionsWhite: Piece[] = [
    { type: 'N', isWhite: true, selected: false, id: 0, column: 0, row: 0 },
    { type: 'B', isWhite: true, selected: false, id: 1, column: 0, row: 0 },
    { type: 'R', isWhite: true, selected: false, id: 2, column: 0, row: 0 },
    { type: 'Q', isWhite: true, selected: false, id: 3, column: 0, row: 0 },
  ];

  promitionOptionsBlack: Piece[] = [
    { type: 'n', isWhite: false, selected: false, id: 0, column: 0, row: 0 },
    { type: 'b', isWhite: false, selected: false, id: 1, column: 0, row: 0 },
    { type: 'r', isWhite: false, selected: false, id: 2, column: 0, row: 0 },
    { type: 'q', isWhite: false, selected: false, id: 3, column: 0, row: 0 },
  ];

  promotionOptions: Piece[] = [];

  showPromotionMenu(pieceToPromote: Piece): Promise<PieceType> {
    this.promotionOptions = pieceToPromote.isWhite ? this.promitionOptionsWhite : this.promitionOptionsBlack;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.promotionSelectorTrigger.menuClosed.subscribe(() => { if (this.resolve !== null) { this.resolve = null; } });
      this.promotionSelectorTrigger.openMenu();
    });
  }

  onPromotionSelection(piece: Piece) {
    if (this.resolve) {
      this.resolve(piece.type);
      this.resolve = null; // Clear the resolve function to prevent multiple calls
    } else {
      console.error('Resolve function is not defined');
    }
    this.promotionSelectorTrigger.closeMenu();
  }
}
