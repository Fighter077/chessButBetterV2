import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../components/dialogs/login/login.component';
import { UserService } from '../../services/user/user.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { LoadingButtonComponent } from "../../components/loading-button/loading-button.component";
import { LoadingService } from 'src/app/services/loading/loading.service';
import { map, Observable, Subscription } from 'rxjs';
import { fadeInOut } from 'src/app/animations/fade.animation';
import { User } from 'src/app/interfaces/user';

@Component({
    selector: 'app-home',
    animations: [fadeInOut()],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        LoadingButtonComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
    playLoading = false;
    userSubscription: Subscription | undefined;

    //set false by default
    userLoaded$: Observable<boolean> = new Observable<boolean>(observer => {
        observer.next(false);
    });

    user: User | null = null;

    constructor(private dialog: MatDialog, private userService: UserService, private router: Router, private navigationService: NavigationService, private loadingService: LoadingService) {

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
    }

    ngOnDestroy(): void {
        this.navigationService.clearReturnUrl();
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    playClicked() {
        this.playLoading = true;
        if (this.userService.getCurrentUser() === null) {
            this.userService.createTempAccount().subscribe({
                next: () => {
                    this.userService.fetchCurrentUser().subscribe({
                        next: () => {
                            this.playLoading = false;
                            this.router.navigate(['/play']);
                        }
                    });
                },
                error: (error) => {
                    console.error('Error creating temporary account:', error);
                }
            });
        } else {
            this.playLoading = false;
            this.router.navigate(['/play']);
        }
    }

    loginDialog() {
        this.dialog.open(LoginComponent);
    }
}
