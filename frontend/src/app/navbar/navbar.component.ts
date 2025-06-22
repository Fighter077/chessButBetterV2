import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { fadeRouteAnimation } from '../animations/route.animation';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../components/dialogs/login/login.component';
import { UserService } from '../services/user/user.service';
import { User } from '../interfaces/user';
import { AvatarComponent } from '../components/avatar/avatar.component';
import { expandCollapse, fadeInOut, slideLeftRight } from '../animations/fade.animation';
import { LoadingService } from '../services/loading/loading.service';
import { CookiesComponent } from "../components/cookies/cookies.component";
import { LinkComponent } from "../components/link/link.component";
import { openConfirmDialog } from '../components/dialogs/confirm/openConfirmdialog.helper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LanguageSwitcherComponent } from "./language-switcher/language-switcher.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    fadeRouteAnimation,
    fadeInOut(),
    slideLeftRight(300, 'both'),
    expandCollapse('horizontal', 0, 'both')
  ],
  imports: [
    CommonModule,
    AsyncPipe,
    RouterModule,
    RouterOutlet,
    ThemeSwitcherComponent,
    AvatarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    CookiesComponent,
    LinkComponent,
    MatProgressSpinnerModule,
    LanguageSwitcherComponent,
    TranslateModule
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('drawer')
  drawer!: MatSidenav; // Reference to the sidenav drawer

  user: User | null = null;

  userLoaded$!: Observable<boolean>;
  isLoading: boolean = false; // Flag to indicate loading state of routing component
  constructor(private dialog: MatDialog, private userService: UserService, private loadingService: LoadingService, private router: Router, private translateService: TranslateService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false;
      }
    });
  }

  userSubscription: Subscription | undefined; // Subscription to the user events

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user; // Update user when it changes
    });

    this.userLoaded$ = this.loadingService.getLoadingState('user').pipe(
      map(loading => !loading) // Invert loading state to get loaded state
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe(); // Unsubscribe from user events to prevent memory leaks
    }
  }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isTiny$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? null;
  }

  loginDialog(): void {
    this.dialog.open(LoginComponent);
  }

  logout(): void {
    const logoutFunc = () => {
      return this.userService.logout().pipe(
        tap(() => {
          this.user = null;
        })
      );
    };

    const text = [
      'LOGOUT_WARNING'
    ];
    if (this.userService.getCurrentUser()?.role === 'TEMP_USER') {
      text.push('TEMP_USER_LOGOUT_WARNING');
    }

    openConfirmDialog(
      this.dialog,
      this.translateService,
      'LOGOUT',
      text,
      'LOGOUT',
      logoutFunc
    );
  }

  closeSideBarIfHandset(): void {
    if (this.breakpointObserver.isMatched([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])) {
      if (this.drawer) {
        this.drawer.close(); // Close the sidenav if it's open
      }
    }
  }
}
