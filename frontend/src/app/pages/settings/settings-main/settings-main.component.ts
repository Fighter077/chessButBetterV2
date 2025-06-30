import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, MatButtonToggleDefaultOptions, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { openConfirmDialog } from 'src/app/components/dialogs/confirm/openConfirmdialog.helper';
import { CookiesService } from 'src/app/services/cookies/cookies.service';

@Component({
  selector: 'app-settings-main',
  imports: [
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslateModule,
    MatButtonToggleModule
  ],
  templateUrl: './settings-main.component.html',
  styleUrl: './settings-main.component.scss',
  providers: [
    {
      provide: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatButtonToggleDefaultOptions
    }
  ],
})
export class SettingsMainComponent {
  cookiesEnabled: boolean | 'functional' = false;
  cookiesLoading: boolean = true;

  constructor(private cookiesService: CookiesService, private dialog: MatDialog, private translateService: TranslateService) {
    // Initialize settings or fetch from a service if needed
    this.cookiesService.cookiesAccepted$.subscribe(accepted => {
      this.cookiesEnabled = accepted;
      this.cookiesLoading = false;
    });
  }

  getCookiesEnabled(): boolean | 'functional' {
    return this.cookiesEnabled;
  }

  setCookiesEnabled(enabled: boolean | 'functional'): void {
    setTimeout(() => {
      const temp = this.cookiesEnabled;
      this.cookiesEnabled = this.cookiesEnabled !== false ? false : 'functional';
      setTimeout(() => {
        this.cookiesEnabled = temp;
      });
    });
    const toggle = () => {
      this.cookiesLoading = true;
      return new Observable<void>((observer) => {
        this.cookiesLoading = true;
        this.cookiesEnabled = enabled;
        if (enabled === false) {
          this.cookiesService.rejectCookies().then(() => {
            this.cookiesLoading = false;
            observer.next();
            observer.complete();
          });
        } else {
          this.cookiesService.acceptCookies(enabled === true).then(() => {
            this.cookiesLoading = false;
            observer.next();
            observer.complete();

            this.cookiesService.sendCookieConsentEvent({
              acceptanceLevel: (
                enabled === true ? 'ACCEPTED_FULL' : 'ACCEPTED_PARTIAL'
              )
            }).subscribe();
          });
        }

      });
    };

    if (enabled === true) {
      openConfirmDialog(
        this.dialog,
        this.translateService,
        'SETTINGS_SITE.ACCEPT_COOKIES.TITLE',
        ['SETTINGS_SITE.ACCEPT_COOKIES.MESSAGE'],
        'SETTINGS_SITE.ACCEPT_COOKIES.CONFIRM',
        toggle
      );
    } else if (enabled === 'functional') {
      openConfirmDialog(
        this.dialog,
        this.translateService,
        'SETTINGS_SITE.FUNCTIONAL_COOKIES.TITLE',
        ['SETTINGS_SITE.FUNCTIONAL_COOKIES.MESSAGE'],
        'SETTINGS_SITE.FUNCTIONAL_COOKIES.CONFIRM',
        toggle
      );
    } else if (enabled === false) {
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
