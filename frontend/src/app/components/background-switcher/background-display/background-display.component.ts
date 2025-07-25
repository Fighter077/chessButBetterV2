import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ErrorComponent } from 'src/app/icons/error/error.component';
import { BackgroundOption } from 'src/app/interfaces/background';

@Component({
  selector: 'app-background-display',
  imports: [
    CommonModule,
    // Angular Material imports
    MatProgressSpinner,
    ErrorComponent
  ],
  templateUrl: './background-display.component.html',
  styleUrl: './background-display.component.scss'
})
export class BackgroundDisplayComponent {
  @Input() background: BackgroundOption = { name: '', path: '', path_low_res: '' };

  loading = true;
  error = false;

  onImageLoad() {
    this.loading = false; // Set loading to false on successful load
    this.error = false; // Reset error state on successful load
  }

  onImageError() {
    this.loading = false;
    this.error = true;
  }
}
