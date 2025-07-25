import { Component, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgProgressbar } from 'ngx-progressbar';

@Component({
  selector: 'app-lazy-loading-indicator',
  imports: [
    NgProgressbar
  ],
  templateUrl: './lazy-loading-indicator.component.html',
  styleUrl: './lazy-loading-indicator.component.scss'
})
export class LazyLoadingIndicatorComponent {
  @ViewChild(NgProgressbar)
  progressBar!: NgProgressbar;

  initial: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!this.initial) {
          this.progressBar.progressRef.start();
        }
        this.initial = false;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.progressBar.progressRef.complete();
      }
    });
  }
}
