import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Piece } from '../../../../../../interfaces/game';
import { CommonModule } from '@angular/common';
import { pieceFullMapping } from 'src/app/constants/chess.constants';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';
import { SafeHtml } from '@angular/platform-browser';
import { fadeInOut } from 'src/app/animations/fade.animation';

@Component({
  animations: [fadeInOut()],
  selector: 'app-piece',
  imports: [
    CommonModule
  ],
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.scss'
})
export class PieceComponent implements OnInit, OnChanges {
  @Input() piece: Piece = { id: 0, row: 0, column: 0, type: '', isWhite: false, selected: false };
  @Input() givesCheck: boolean = false; // Flag to indicate if the piece gives check
  @Input() inCheck: boolean = false; // Flag to indicate if the piece is in check
  @Input() noLocation: boolean = false;
  @Output() clicked: EventEmitter<Piece> = new EventEmitter<Piece>();

  captureElements: null[] = [];

  thisElement: HTMLElement | null = null;

  svgContent: SafeHtml | null = null;

  constructor(private el: ElementRef, private assetLoaderService: AssetLoaderService) {
    this.thisElement = this.el.nativeElement;
    this.captureElements = new Array(9).fill(null);
  }

  ngOnInit(): void {
    if (!this.noLocation) {
      this.updatePosition(); // Update the position of the piece on initialization
    }
    this.loadImg(); // Load the image of the piece
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['piece'] && !changes['piece'].firstChange && (
      changes['piece'].currentValue.row !== changes['piece'].previousValue.row || changes['piece'].currentValue.column !== changes['piece'].previousValue.column
    )) {
      if (!this.noLocation) {
        const fromLeft = this.calculatePosition(changes['piece'].previousValue.column);
        const fromTop = this.calculatePosition(changes['piece'].previousValue.row, true);
        this.updatePosition(fromLeft, fromTop); // Update the position if the piece has moved
      }
    }
    // if piece type changes, reload the image
    if (changes['piece'] && changes['piece'].currentValue?.type !== changes['piece'].previousValue?.type) {
      this.loadImg();
    }
  }

  updatePosition(fromLeft: number | null = null, fromTop: number | null = null): void {
    const movePiece = () => {
      if (this.thisElement) {
        const newLeft = this.calculatePosition(this.piece.column);
        const newTop = this.calculatePosition(this.piece.row, true);

        requestAnimationFrame(() => {
          if (this.thisElement) {
            this.thisElement.style.left = newLeft + '%';
            this.thisElement.style.top = newTop + '%';
          }
        });
      }
    }

    // If fromLeft or fromTop is provided, use it to calculate the new position
    if (fromLeft && fromTop) {
      requestAnimationFrame(() => {
        if (this.thisElement) {
          this.thisElement.style.left = fromLeft + '%';
          this.thisElement.style.top = fromTop + '%';

          movePiece(); // Call movePiece after setting the initial position
        }
      });
    } else {
      movePiece(); // Call movePiece directly if no initial position is provided
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
