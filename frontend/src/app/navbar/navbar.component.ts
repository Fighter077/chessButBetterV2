import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { fadeRouteAnimation } from '../animations/route.animation';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './dialogs/login/login.component';
import { Userservice } from '../services/user/user.service';
import { User } from '../interfaces/user';
import { AvatarComponent } from '../components/avatar/avatar.component';
import { expandCollapse, fadeInOut, slideLeftRight } from '../animations/fade.animation';
import { LoadingService } from '../services/loading/loading.service';
import { CookiesComponent } from "../components/cookies/cookies.component";
import { LinkComponent } from "../components/link/link.component";

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
export class NavbarComponent implements OnInit {
  user: User | null = null; // Initialize user to null

  userLoaded$!: Observable<boolean>;


  constructor(private dialog: MatDialog, private userService: Userservice, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user; // Update user when it changes
    });

    this.userLoaded$ = this.loadingService.states$.pipe(
      map(states => !states['user']) // returns true or false
    );
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
    this.dialog.open(LoginComponent, {
      width: '400px',
    });
  }

  logout(): void {
    this.userService.logout().subscribe(() => {
      this.user = null; // Reset user to null on logout
    });
  }
}
