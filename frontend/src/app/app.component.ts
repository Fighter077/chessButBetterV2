import { Component, OnDestroy } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { UserService } from './services/user/user.service';
import { ThemeDataService } from './services/theme/theme-data.service';

import { LoadingService } from './services/loading/loading.service';
import { filter, Observable, Subscription, tap } from 'rxjs';
import { fadeOut } from './animations/fade.animation';
import { CookiesService } from './services/cookies/cookies.service';
import { protectedRoutes } from './constants/protectedRoutes.constants';
import { roleSuffices } from './constants/roleHierarchy.constants';
import { NavigationEnd, Router } from '@angular/router';
import { SeoService } from './services/seo/seo.service';
import { meta } from './constants/meta.constants';
import { Stack } from './constants/stack.constants';
import { RouteTree } from './interfaces/routeTree';
import { TranslateService } from '@ngx-translate/core';
import { supportedLanguages } from './constants/languages.constants';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fadeOut()]
})
export class AppComponent implements OnDestroy {
  title = 'chessButBetterAng';

  loading$: Observable<boolean> = new Observable<false>();

  userSubscription: Subscription | undefined; // Subscription to the user events
  loadingSubscription: Subscription | undefined; // Subscription to the loading events

  constructor(private cookiesService: CookiesService, private userService: UserService, private themeData: ThemeDataService,
    private loadingService: LoadingService, private router: Router, private seoService: SeoService, private translateService: TranslateService) {

    // Add alternate links for supported languages for SEO purposes
    for (const lang of supportedLanguages) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `https://www.chessbutbetter.com/${lang}`;
      document.head.appendChild(link);
    }

    if (environment.production) {
      // Setup function that could send data to Google Analytics
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
      `;
      const firstChild = document.head.firstChild;
      if (firstChild) {
        document.head.insertBefore(script2, firstChild);
      } else {
        document.head.appendChild(script2);
      }
    }

    // Add alternate links for supported languages for SEO purposes
    for (const lang of supportedLanguages) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `https://www.chessbutbetter.com/${lang}`;
      document.head.appendChild(link);
    }

    this.themeData.applySelectedTheme(); // Apply the selected theme on app load

    this.translateService.onLangChange.subscribe((event) => {
      this.cookiesService.setCookie('selectedLanguage', event.lang);
    });

    // Check if the user has accepted cookies
    this.cookiesService.checkCookiesAccepted().then(() => {
      this.userSubscription = this.userService.fetchCurrentUser().subscribe({
        next: () => { },
        error: err => console.error('Failed to load user', err)
      });
    });

    // Subscribe to loading$ observable from LoadingService
    this.loading$ = this.loadingService.loading$;

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

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      // Update the SEO meta tags based on the current route

      const currentRoute: Stack = new Stack();
      this.router.url.split('/').forEach((segment: string) => currentRoute.push(segment));
      // Remove the first empty segment
      currentRoute.pop();
      let metaData: RouteTree = JSON.parse(JSON.stringify(meta));
      while (currentRoute.hasNext() && (metaData.children?.[currentRoute.peek()!] || (metaData.children && Object.keys(metaData.children).some(key => key.startsWith(':'))))) {
        // Check if the current route is a dynamic route (e.g., ':id')
        // If so, we need to find the first matching child route
        const dynamicRoute = Object.keys(metaData.children || {}).find(key => key.startsWith(':'));
        if (dynamicRoute) {
          metaData = metaData.children[dynamicRoute];
          metaData.interpolation = { 'gameID': currentRoute.peek()! };
          metaData.title = metaData.title.replace(':id', currentRoute.peek()!);
        } else {
          metaData = metaData.children[currentRoute.pop()!];
        }
      }
      if (metaData) {
        this.seoService.updateMeta(this.translateService.stream(metaData.title, metaData.interpolation), this.translateService.stream(metaData.description, metaData.interpolation));
        this.seoService.updateHreflangTags();
      }
    });
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
