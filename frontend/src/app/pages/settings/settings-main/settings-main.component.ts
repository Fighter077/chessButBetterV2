import { Component } from '@angular/core';
import { CookiesToggleComponent } from "src/app/components/cookies/cookies-toggle/cookies-toggle.component";
import { BackgroundSwitcherComponent } from "src/app/components/background-switcher/background-switcher.component";

@Component({
  selector: 'app-settings-main',
  imports: [
    CookiesToggleComponent,
    BackgroundSwitcherComponent
],
  templateUrl: './settings-main.component.html',
  styleUrl: './settings-main.component.scss',
})
export class SettingsMainComponent {
  
}
