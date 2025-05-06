import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../components/dialogs/login/login.component';
import { UserService } from '../../services/user/user.service';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
    constructor(private dialog: MatDialog, private userService: UserService, private router: Router, private navigationService: NavigationService) { }

    ngOnInit(): void {
        if (this.navigationService.getReturnUrl()) {
            this.loginDialog();
        }
    }

    ngOnDestroy(): void {
        this.navigationService.clearReturnUrl();
    }

    playClicked() {
        if (this.userService.getCurrentUser()) {
            this.router.navigate(['/play']);
        } else {
            this.loginDialog();
        }
    }

    loginDialog() {
        this.dialog.open(LoginComponent);
    }
}
