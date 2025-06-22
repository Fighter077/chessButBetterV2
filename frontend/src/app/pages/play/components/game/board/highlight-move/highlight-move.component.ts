import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Move } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-highlight-move',
  imports: [],
  templateUrl: './highlight-move.component.html',
  styleUrl: './highlight-move.component.scss'
})
export class HighlightMoveComponent implements AfterViewInit, OnChanges {
  @Input() move: Move | null = null; // Move to highlight
  /*@ViewChild('highlightFrom')
  highlightFrom!: ElementRef<HTMLDivElement>; // Reference to the highlight element
  @ViewChild('highlightTo')
  highlightTo!: ElementRef<HTMLDivElement>; // Reference to the highlight element*/
  @ViewChild('highlightArrow')
  highlightArrow!: ElementRef<HTMLDivElement>; // Reference to the highlight element
  @ViewChild('highlightArrowHead')
  highlightArrowHead!: ElementRef<HTMLDivElement>; // Reference to the highlight element

  constructor(private gameService: GameService) {
  }

  ngAfterViewInit() {
    this.updatePosition(); // Update the position of the highlight on initialization
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['move'] && !changes['move'].firstChange) {
      this.updatePosition(); // Update the position of the highlight when the move changes
    }
  }

  updatePosition() {
    if (this.move && this.highlightArrow?.nativeElement && this.highlightArrowHead?.nativeElement) {
      const { fromRow, fromCol, toRow, toCol } = this.gameService.convertFromMove(this.move.move);

      const x1 = this.calculatePosition(fromCol, false);
      const y1 = this.calculatePosition(fromRow, true) - 1;
      const x2 = this.calculatePosition(toCol, false);
      const y2 = this.calculatePosition(toRow, true) - 1;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      this.highlightArrow.nativeElement.style.left = x1 + '%';
      this.highlightArrow.nativeElement.style.top = `calc(${y1}% + 5px)`;
      this.highlightArrow.nativeElement.style.width = length + '%';
      this.highlightArrow.nativeElement.style.transform = `rotate(${angle}deg)`;

      this.highlightArrowHead.nativeElement.style.left = `calc(${x2}% + 0px)`;
      this.highlightArrowHead.nativeElement.style.top = `calc(${y2}% + 2.5px)`;
      this.highlightArrowHead.nativeElement.style.transform = `rotate(${angle}deg)`;
    }
  }

  calculatePosition(position: number, reverse: boolean = false): number {
    if (reverse) {
      return 100 - (100 * ((position) / 8)) - (12.5 / 2);
    }
    return (100 * ((position) / 8)) + (12.5 / 2);
  }
}
