import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { RouterModule, RouterOutlet } from '@angular/router';
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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    fadeRouteAnimation,
    fadeInOut(),
    slideLeftRight(300, 'both'),
    expandCollapse('vertical', 0, 'both')
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
    LinkComponent
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;

  userLoaded$!: Observable<boolean>;
  constructor(private dialog: MatDialog, private userService: UserService, private loadingService: LoadingService) { }

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

    openConfirmDialog(
      this.dialog,
      'Logout',
      'Are you sure you want to logout?',
      'Logout',
      logoutFunc
    );
  }
}
