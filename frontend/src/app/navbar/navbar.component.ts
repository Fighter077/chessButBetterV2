import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { getRouteAnimationData } from '../animations/route.animation';
import { BackgroundService } from '../services/theme/background.service';
import { BackgroundOption } from '../interfaces/background';
import { LazyLoadingIndicatorComponent } from "../components/lazy-loading-indicator/lazy-loading-indicator.component";

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
    TranslateModule,
    LazyLoadingIndicatorComponent
]
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('drawer')
  drawer!: MatSidenav; // Reference to the sidenav drawer

  @ViewChild('contentWrapper')
  contentWrapper!: ElementRef<HTMLDivElement>; // Reference to the content area

  getRouteAnimationData = getRouteAnimationData;

  user: User | null = null;

  userLoaded$!: Observable<boolean>;
  isLoading: boolean = false; // Flag to indicate loading state of routing component

  isTransitioning: boolean = false; // Flag to indicate if a transition is in progress
  transitionCounter: number = 0; // Counter to track the number of transitions

  currentBackgrounds: BackgroundOption[] = []; // Current background option

  bgTransitionDuration: number = 300; // Duration for background transition in milliseconds
  bgInitialLoadDuration: number = 100; // Duration for initial background load in milliseconds

  routerSubscription: Subscription | undefined; // Subscription to the router events
  userSubscription: Subscription | undefined; // Subscription to the user events
  bgSubscription: Subscription | undefined; // Subscription to the background service

  constructor(private dialog: MatDialog, private userService: UserService, private loadingService: LoadingService, public router: Router, private translateService: TranslateService, private backgroundService: BackgroundService) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user; // Update user when it changes
    });

    this.userLoaded$ = this.loadingService.getLoadingState('user').pipe(
      map(loading => !loading) // Invert loading state to get loaded state
    );
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe(); // Unsubscribe from router events to prevent memory leaks
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe(); // Unsubscribe from user events to prevent memory leaks
    }
    if (this.bgSubscription) {
      this.bgSubscription.unsubscribe(); // Unsubscribe from background service to prevent memory leaks
    }
  }

  ngAfterViewInit(): void {
    if (this.contentWrapper) {
      const contentElement = this.contentWrapper.nativeElement as HTMLDivElement;
      contentElement.style.setProperty('--bgTransitionDuration', `${this.bgTransitionDuration}ms`); // Set the background transition duration
      contentElement.style.setProperty('--bgInitialLoadDuration', `${this.bgInitialLoadDuration}ms`); // Set the initial background load duration
    }

    this.bgSubscription = this.backgroundService.background.subscribe((background) => {
      if (background) {
        this.currentBackgrounds.push({ ...background, loaded: false, initial: this.currentBackgrounds.length === 0 }); // Add the background to the current backgrounds
      }
    });
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

  transitionStart() {
    this.isTransitioning = true;
    this.transitionCounter++;
  }

  transitionEnd() {
    this.transitionCounter--;
    if (this.transitionCounter <= 0) {
      this.isTransitioning = false;
      this.transitionCounter = 0;
    }
  }

  onBackgroundLoaded(backgroundPath: string): void {
    // Find the background option that matches the path
    const newBackgrounds = [...this.currentBackgrounds];
    const backgroundOptionIndex = newBackgrounds.findIndex(bg => bg.path === backgroundPath);
    if (backgroundOptionIndex > -1) {
      // All backgrounds in the array before the current one are set to loaded = false
      for (let i = 0; i < backgroundOptionIndex; i++) {
        newBackgrounds[i] = { ...newBackgrounds[i], loaded: false }; // Set loaded to false for previous backgrounds
      }
      newBackgrounds[backgroundOptionIndex] = { ...newBackgrounds[backgroundOptionIndex], loaded: true }; // Set loaded to true for the background
    }
    setTimeout(() => {
      const newBackgrounds = [...this.currentBackgrounds];
      const backgroundOptionIndex = newBackgrounds.findIndex(bg => bg.path === backgroundPath);
      const newBackgroundsFiltered = newBackgrounds.filter((_, index) => index >= backgroundOptionIndex); // Filter out all backgrounds before the current one
      const backgroundOptionIndex2 = newBackgroundsFiltered.findIndex(bg => bg.path === backgroundPath);
      // if the last background is loaded, remove set loading to true
      if (newBackgroundsFiltered[newBackgroundsFiltered.length - 1].path === backgroundPath) {
        this.backgroundService.setBackgroundLoaded(true);
      }
      if (newBackgroundsFiltered[backgroundOptionIndex2].initial) {
        newBackgroundsFiltered[backgroundOptionIndex2] = { ...newBackgroundsFiltered[backgroundOptionIndex2], initial: false }; // Set initial to false for the first background
      }
      this.currentBackgrounds = newBackgroundsFiltered; // Update the current backgrounds
    }, newBackgrounds[backgroundOptionIndex].initial ? this.bgInitialLoadDuration : this.bgTransitionDuration); // Wait for 5 seconds before checking the last background
    this.currentBackgrounds = newBackgrounds; // Update the current backgrounds
  }
}
