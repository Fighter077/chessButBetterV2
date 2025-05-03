// Angular imports
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
// Angular Material imports
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    // Angular imports
    CommonModule,
    // Angular Material imports
    MatIcon
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input () icon: string = 'error';
  @Input () size: string = '24px';
  @Input () color: string = 'inherit';
}
