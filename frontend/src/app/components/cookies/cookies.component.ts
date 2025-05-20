import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CookiesService } from '../../services/cookies/cookies.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { fadeOut } from '../../animations/fade.animation';
import { IconComponent } from "../../icons/icon.component";
import { LinkComponent } from "../link/link.component";

@Component({
  selector: 'app-cookies',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    IconComponent,
    LinkComponent
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

    this.observer.observe(this.el.nativeElement, {
      box: 'border-box'
    });
  }

  ngOnInit(): void {
    this.cookiesService.checkCookiesAccepted().then(accepted => {
      this.showCookiesBanner = !accepted;
      if (this.showCookiesBanner) {
        this.observer.observe(document.body, {
          box: 'border-box'
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  acceptCookies(): void {
    this.cookiesService.acceptCookies();
    this.showCookiesBanner = false;
  }

  closeBanner(): void {
    this.showCookiesBanner = false;
  }

}
