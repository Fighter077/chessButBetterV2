import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { Userservice } from './services/user/user.service';
import { ThemeDataService } from './services/theme/theme-data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading/loading.service';
import { Observable } from 'rxjs';
import { fadeOut } from './animations/fade.animation';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NavbarComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fadeOut()]
})
export class AppComponent implements OnInit {
  title = 'chessButBetterAng';

  loading$: Observable<boolean> = new Observable<false>();

  constructor(private userService: Userservice, private themeData: ThemeDataService, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.themeData.applySelectedTheme(); // Apply the selected theme on app load

    // Subscribe to loading$ observable from LoadingService
    this.loading$ = this.loadingService.loading$;

    this.userService.fetchCurrentUser().subscribe({
      next:() => {},
      error: err => console.error('Failed to load user', err)
    });;
  }
}
