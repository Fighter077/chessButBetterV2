import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS, MatButtonToggleDefaultOptions, MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { getRouteAnimationData, settingsAnim } from 'src/app/animations/route.animation';
import { IconComponent } from "../../icons/icon.component";
import { LinkComponent } from "../../components/link/link.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
    animations: [
        settingsAnim
    ],
    selector: 'app-settings',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        MatButtonToggleModule,
        IconComponent,
        LinkComponent,
        MatTooltipModule,
        TranslateModule
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    providers: [
    {
      provide: MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,
      useValue: { disabledInteractive: true } as MatButtonToggleDefaultOptions
    }
  ],
})
export class SettingsComponent implements AfterViewInit {

    routeOptions = [
        {
            'icon': 'home',
            'name': 'SETTINGS_SITE.SETTINGS',
            'route': '/settings'
        },
        {
            'icon': 'person',
            'name': 'SETTINGS_SITE.USER',
            'route': '/settings/user'
        },
        {
            'icon': 'sports_esports',
            'name': 'SETTINGS_SITE.GAMEPLAY',
            'route': '/settings/gameplay'
        }
    ];

    routeOptionsCount: number[] = [1];

    routeOptionsSplit: any[] = [];

    constructor(public router: Router, private cd: ChangeDetectorRef) {
        let counter = 0;
        for (let i = 0; i < this.routeOptionsCount.length; i++) {
            if (counter < this.routeOptions.length) {
                this.routeOptionsSplit.push(this.routeOptions.filter((_, j) => j < this.routeOptionsCount[i] + counter && j >= counter));
            }
            counter += this.routeOptionsCount[i];
        }
        if (counter < this.routeOptions.length) {
            this.routeOptionsSplit.push(this.routeOptions.slice(counter));
        }


        console.log('Route options split:', this.routeOptionsSplit);
    }


    getRouteAnimationData = getRouteAnimationData;

    isTransitioning = false;
    transitionCounter = 0;

    ngAfterViewInit() {
        this.cd.detectChanges();
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
}
