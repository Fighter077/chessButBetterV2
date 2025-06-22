import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class PieceComponent implements OnInit, OnChanges {
  @Input() piece: Piece = { id: 0, row: 0, column: 0, type: '', isWhite: false, selected: false };
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['piece'] && !changes['piece'].firstChange && (
      changes['piece'].currentValue.row !== changes['piece'].previousValue.row || changes['piece'].currentValue.column !== changes['piece'].previousValue.column
    )) {
      this.updatePosition();
    }
  }

  updatePosition(): void {
    if (this.thisElement) {
      const newLeft = this.calculatePosition(this.piece.column);
      const newTop = this.calculatePosition(this.piece.row, true);

      requestAnimationFrame(() => {
        this.thisElement!.style.left = newLeft + '%';
        this.thisElement!.style.top = newTop + '%';
      });
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
