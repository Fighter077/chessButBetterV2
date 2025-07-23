import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class BackgroundDisplayComponent implements OnInit {
  @Input() background: BackgroundOption = { name: '', path: '' };

  loading = true;
  error = false;

  ngOnInit(): void {
    this.loading = false;
  }
}
