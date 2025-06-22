import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-loading-button',
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.scss'
})
export class LoadingButtonComponent {
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() routerLink: any;
  @Input() ariaLabel?: string;
  @Input() class?: string;
  @Input() fullWidth = false;
  @Input() variant: 'raised' | 'flat' | 'stroked' | 'basic' | 'icon' = 'basic';
  @Input() tooltip?: string;
  @Input() loadingTooltip?: string = this.tooltip;
  @Input() tooltipPosition: 'above' | 'below' | 'left' | 'right' | 'before' | 'after' = 'below';
  @Input() tooltipClass: string | string[] = '';
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();

  onClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }
    this.buttonClicked.emit();
  }
}
