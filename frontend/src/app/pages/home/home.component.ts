import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../components/dialogs/login/login.component';
import { UserService } from '../../services/user/user.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { LoadingButtonComponent } from "../../components/loading-button/loading-button.component";
import { LoadingService } from 'src/app/services/loading/loading.service';
import { map, Observable, Subscription } from 'rxjs';
import { expandCollapse, fadeInOut } from 'src/app/animations/fade.animation';
import { User } from 'src/app/interfaces/user';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TimeSelectorComponent } from "../../components/time-selector/time-selector.component";
import { Game, TimingOption } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game/game.service';
import { DemoGameComponent } from "../../components/demo-game/demo-game.component";

@Component({
    selector: 'app-home',
    animations: [fadeInOut(), expandCollapse('horizontal', 0, 'both', null)],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        LoadingButtonComponent,
        TranslateModule,
        MatButtonModule,
        TimeSelectorComponent,
        DemoGameComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
    playLoading = false;
    userSubscription: Subscription | undefined;

    game: Game | null | "demo" = null;

    //set false by default
    userLoaded$: Observable<boolean> = new Observable<boolean>(observer => {
        observer.next(false);
    });

    user: User | null = null;

    selectedTimingOption: TimingOption = null;

    constructor(private dialog: MatDialog, private userService: UserService, private gameService: GameService,
        private router: Router, private navigationService: NavigationService, private loadingService: LoadingService) {

        this.userSubscription = this.userService.user$.subscribe(user => {
            this.user = user; // Update user when it changes
        });

        this.userLoaded$ = this.loadingService.getLoadingState('user').pipe(
            map(loading => !loading) // Invert the loading state to get the loaded state
        );
    }

    ngOnInit(): void {

        if (this.navigationService.getReturnUrl()) {
            this.loginDialog();
        }

        this.userService.user$.subscribe(user => {
            if (user) {
                this.gameService.getActiveGames().subscribe({
                    next: (games) => {
                        if (games.length > 0) {
                            this.game = games[0]; // Assuming you want to display the first active game
                        } else {
                            this.game = "demo";
                        }
                    }
                });
            } else {
                this.game = "demo"; // Reset game if user is not logged in
            }

        });
    }

    ngOnDestroy(): void {
        this.navigationService.clearReturnUrl();
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    playClicked() {
        const navigate = () => {
            this.playLoading = false;
            if (this.selectedTimingOption) {
                this.router.navigate(['/play'], {
                    queryParams: {
                        start: this.selectedTimingOption.start,
                        increment: this.selectedTimingOption.increment
                    }
                });
            } else {
                this.router.navigate(['/play']);
            }
        }

        this.playLoading = true;
        if (this.userService.getCurrentUser() === null) {
            this.userService.createTempAccount().subscribe({
                next: () => {
                    this.userService.fetchCurrentUser().subscribe({
                        next: () => {
                            navigate();
                        }
                    });
                },
                error: (error) => {
                    console.error('Error creating temporary account:', error);
                }
            });
        } else {
            navigate();
        }
    }

    loginDialog() {
        this.dialog.open(LoginComponent);
    }

    onTimeSelected(timingOption: TimingOption) {
        this.selectedTimingOption = timingOption;
    }
}
