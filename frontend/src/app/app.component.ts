import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { UserService } from './services/user/user.service';
import { ThemeDataService } from './services/theme/theme-data.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading/loading.service';
import { filter, Observable, tap } from 'rxjs';
import { fadeOut } from './animations/fade.animation';
import { CookiesService } from './services/cookies/cookies.service';
import { protectedRoutes } from './constants/protectedRoutes.constants';
import { roleSuffices } from './constants/roleHierarchy.constants';
import { Router } from '@angular/router';

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
export class AppComponent {
  title = 'chessButBetterAng';

  loading$: Observable<boolean> = new Observable<false>();

  constructor(private cookiesService: CookiesService, private userService: UserService, private themeData: ThemeDataService, private loadingService: LoadingService, private router: Router) {
    // Check if the user has accepted cookies
    this.cookiesService.checkCookiesAccepted();

    this.themeData.applySelectedTheme(); // Apply the selected theme on app load

    // Subscribe to loading$ observable from LoadingService
    this.loading$ = this.loadingService.loading$;

    this.userService.fetchCurrentUser().subscribe({
      next: () => { },
      error: err => console.error('Failed to load user', err)
    });

    // When user has loaded, then changes (due to logout), check if user is on protected route and has sufficient permissions
    // If not, redirect to home
    this.loadingService.getLoadingState('user').pipe(
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
}
