import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-indicator',
  imports: [],
  templateUrl: './time-indicator.component.html',
  styleUrl: './time-indicator.component.scss'
})
export class TimeIndicatorComponent {
  @Input() timeLeft: number = 0; // Time left in ms
  @Input() isActive: boolean = false; // Flag to indicate if the timer is active

  formattedTime(): string {
    const secondsLeft = this.timeLeft / 1000;
    // Format the time left in mm:ss format
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = Math.floor(secondsLeft % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
