import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CookiesService } from '../../services/cookies/cookies.service';

import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { fadeOut } from '../../animations/fade.animation';
import { LinkComponent } from "../link/link.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cookies',
  imports: [
    RouterModule,
    MatButtonModule,
    LinkComponent,
    TranslateModule
  ],
  animations: [fadeOut()],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss'
})
export class CookiesComponent implements OnInit, OnDestroy {
  showCookiesBanner: boolean = true;
  private observer: ResizeObserver;

  constructor(private el: ElementRef, private cookiesService: CookiesService) {
    this.observer = new ResizeObserver((entries) => {
      for (const _ of entries) {
        document.documentElement.style.setProperty('--cookies-height', `${this.el.nativeElement.offsetHeight}px`);
      }
    });
  }

  ngOnInit(): void {
    this.cookiesService.checkCookiesAccepted();

    this.cookiesService.cookiesAccepted$.subscribe((accepted) => {
      this.showCookiesBanner = !accepted;
      if (this.showCookiesBanner) {
        this.observer.observe(document.body, {
          box: 'border-box'
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.el.nativeElement, {
      box: 'border-box'
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  acceptFunctionalCookies(): void {
    this.cookiesService.acceptCookies();
    this.showCookiesBanner = false;
  }

  acceptCookies(): void {
    this.cookiesService.acceptCookies(true);
    this.showCookiesBanner = false;
  }

  closeBanner(): void {
    this.showCookiesBanner = false;
  }

}
