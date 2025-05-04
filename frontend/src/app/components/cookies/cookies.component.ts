import { Component, OnInit } from '@angular/core';
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
export class CookiesComponent implements OnInit {
  showCookiesBanner: boolean = true;

  constructor(private cookiesService: CookiesService) {}

  ngOnInit(): void {
    this.showCookiesBanner = !this.cookiesService.checkCookiesAccepted();
  }

  acceptCookies(): void {
    this.cookiesService.acceptCookies();
    this.showCookiesBanner = false;
  }

  closeBanner(): void {
    this.showCookiesBanner = false;
  }

}
