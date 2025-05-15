// Angular imports
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
// Angular Material imports
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon',
  imports: [
    // Angular imports
    CommonModule,
    // Angular Material imports
    MatIcon,
    MatTooltipModule
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  host: {
    '[style.width]': 'size',
    '[style.height]': 'size'
  }
})
export class IconComponent {
  @Input() icon: string = 'error';
  @Input() size: string = '24px';
  @Input() color: string = 'inherit';
  @Input() tooltip: string = '';
  @Input() tooltipPosition: 'above' | 'below' | 'left' | 'right' = 'below';
}
