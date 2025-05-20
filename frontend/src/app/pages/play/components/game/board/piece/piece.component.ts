import { Component, DoCheck, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Piece } from '../../../../../../interfaces/game';
import { CommonModule } from '@angular/common';
import { pieceFullMapping } from 'src/app/constants/chess.constants';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-piece',
  imports: [
    CommonModule
  ],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.scss'
})
export class PieceComponent implements OnInit, DoCheck {
  @Input() piece: Piece = { row: 0, column: 0, type: '', isWhite: false, selected: false };
  @Output() clicked: EventEmitter<Piece> = new EventEmitter<Piece>();

  captureElements: null[] = [];

  thisElement: HTMLElement | null = null;

  svgContent: SafeHtml | null = null;

  constructor(private el: ElementRef, private assetLoaderService: AssetLoaderService) {
    this.thisElement = this.el.nativeElement;
    this.captureElements = new Array(9).fill(null);
  }

  ngOnInit(): void {
    this.updatePosition(); // Update the position of the piece on initialization
    this.loadImg(); // Load the image of the piece
  }

  ngDoCheck(): void {
    if (this.thisElement) {
      this.thisElement.style.left = this.calculatePosition(this.piece.column) + '%';
      this.thisElement.style.top = this.calculatePosition(this.piece.row, true) + '%';
    }
  }

  updatePosition() {
    if (this.thisElement) {
      this.thisElement.style.left = this.calculatePosition(this.piece.column) + '%';
      this.thisElement.style.top = this.calculatePosition(this.piece.row) + '%';
    }
  }

  calculatePosition(position: number, reverse: boolean = false): number {
    if (reverse) {
      return 100 - (100 * ((position) / 8)) - (12.5 / 2);
    }
    return (100 * ((position) / 8)) + (12.5 / 2);
  }

  pieceClicked() {
    this.clicked.emit(this.piece);
  }

  loadImg(): void {
    const pieceType = this.piece.type;
    this.assetLoaderService.loadSvg(`skins-flat/default/${pieceFullMapping[pieceType]}${this.piece.isWhite ? 'White' : 'Black'}.svg`).subscribe((svg: SafeHtml) => {
      this.svgContent = svg;
    });
  }
}
