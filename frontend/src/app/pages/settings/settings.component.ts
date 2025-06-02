
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { openConfirmDialog } from 'src/app/components/dialogs/confirm/openConfirmdialog.helper';
import { CookiesService } from 'src/app/services/cookies/cookies.service';

@Component({
    selector: 'app-settings',
    imports: [
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslateModule
],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    providers: [
        {
            provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
            useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions
        }
    ],
})
export class SettingsComponent {
    cookiesEnabled: boolean = false;
    cookiesLoading: boolean = true;

    constructor(private cookiesService: CookiesService, private dialog: MatDialog, private translateService: TranslateService) {
        // Initialize settings or fetch from a service if needed
        this.cookiesService.cookiesAccepted$.subscribe(accepted => {
            this.cookiesEnabled = accepted;
            this.cookiesLoading = false;
        });
    }

    getCookiesEnabled(): boolean {
        return this.cookiesEnabled;
    }

    setCookiesEnabled(enabled: boolean): void {
        const toggle = () => {
            this.cookiesLoading = true;
            return new Observable<void>((observer) => {
                this.cookiesLoading = true;
                this.cookiesEnabled = enabled;
                if (enabled) {
                    this.cookiesService.acceptCookies().then(() => {
                        this.cookiesLoading = false;
                        observer.next();
                        observer.complete();
                    });
                } else {
                    this.cookiesService.rejectCookies().then(() => {
                        this.cookiesLoading = false;
                        observer.next();
                        observer.complete();
                    });
                }
            });
        };

        if (enabled) {
            openConfirmDialog(
                this.dialog,
                this.translateService,
                'SETTINGS_SITE.ACCEPT_COOKIES.TITLE',
                ['SETTINGS_SITE.ACCEPT_COOKIES.MESSAGE'],
                'SETTINGS_SITE.ACCEPT_COOKIES.CONFIRM',
                toggle
            );
        } else {
            openConfirmDialog(
                this.dialog,
                this.translateService,
                'SETTINGS_SITE.REJECT_COOKIES.TITLE',
                ['SETTINGS_SITE.REJECT_COOKIES.MESSAGE'],
                'SETTINGS_SITE.REJECT_COOKIES.CONFIRM',
                toggle
            );
        }
    }


}
