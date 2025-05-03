import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { Userservice } from './services/user/user.service';
import { User } from './interfaces/user';
import { ThemeDataService } from './services/theme/theme-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'chessButBetterAng';

  user: User | null = null;
  isLoading = true;

  constructor(private userService: Userservice, private themeData: ThemeDataService) {}

  ngOnInit(): void {
    this.themeData.applySelectedTheme(); // Apply the selected theme on app load

    this.userService.fetchCurrentUser().subscribe(
      (data) => {
        this.user = data;
        this.isLoading = false; // Hide loading screen
      },
      (error) => {
        console.error('Error fetching user', error);
        this.isLoading = false; // Hide loading screen even if there is an error
      }
    );
  }
}
