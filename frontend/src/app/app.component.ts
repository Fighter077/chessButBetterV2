import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { UserService } from './services/user/user.service';
import { ThemeDataService } from './services/theme/theme-data.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading/loading.service';
import { filter, Observable, Subscription, tap } from 'rxjs';
import { fadeOut } from './animations/fade.animation';
import { CookiesService } from './services/cookies/cookies.service';
import { protectedRoutes } from './constants/protectedRoutes.constants';
import { roleSuffices } from './constants/roleHierarchy.constants';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fadeOut()]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chessButBetterAng';

  loading$: Observable<boolean> = new Observable<false>();

  userSubscription: Subscription | undefined; // Subscription to the user events
  loadingSubscription: Subscription | undefined; // Subscription to the loading events

  constructor(private cookiesService: CookiesService, private userService: UserService, private themeData: ThemeDataService, private loadingService: LoadingService, private router: Router) {
    // Check if the user has accepted cookies
    this.cookiesService.checkCookiesAccepted();

    this.themeData.applySelectedTheme(); // Apply the selected theme on app load

    // Subscribe to loading$ observable from LoadingService
    this.loading$ = this.loadingService.loading$;

    this.userSubscription = this.userService.fetchCurrentUser().subscribe({
      next: () => { },
      error: err => console.error('Failed to load user', err)
    });

    // When user has loaded, then changes (due to logout), check if user is on protected route and has sufficient permissions
    // If not, redirect to home
    this.loadingSubscription = this.loadingService.getLoadingState('user').pipe(
      filter(userLoading => userLoading === false), // Only proceed when loading is false
      tap(() => {
        this.userService.user$.subscribe(user => {
          //if user currently is on protected route and has not sufficient permissions, redirect to home
          if (protectedRoutes.some(route => this.router.url.includes(route.path) && !roleSuffices(route?.data?.role, user?.role))) {
            this.router.navigate(['/']);
          }
        })
      }
      )).subscribe();
  }

  ngOnInit(): void {
    if (environment.production) {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NF09EE6YY1';
      script.async = true;
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-NF09EE6YY1');`
      const firstChild = document.head.firstChild;
      if (firstChild) {
        document.head.insertBefore(script, firstChild);
        document.head.insertBefore(script2, firstChild);
      } else {
        document.head.appendChild(script);
        document.head.appendChild(script2);
      }
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from user and loading subscriptions to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
