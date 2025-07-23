// Angular imports
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
// Angular Material imports
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
// Component imports
import { BackgroundDisplayComponent } from './background-display/background-display.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { BackgroundService } from 'src/app/services/theme/background.service';
import { BackgroundList, BackgroundOption } from 'src/app/interfaces/background';
import { M } from "../../../../node_modules/@angular/material/progress-spinner.d-Lfz4Wh5x";
import { fadeInOut } from 'src/app/animations/fade.animation';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  animations: [fadeInOut()],
  selector: 'app-background-switcher',
  imports: [
    // Angular imports
    CommonModule,
    FormsModule,
    // Angular Material imports
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckboxModule,
    // Component imports
    BackgroundDisplayComponent,
    TranslateModule,
    MatProgressSpinnerModule
],
  templateUrl: './background-switcher.component.html',
  styleUrl: './background-switcher.component.scss'
})
export class BackgroundSwitcherComponent {
  backgrounds: BackgroundList = this.backgroundService.backgrounds || [];

  currentBackground: BackgroundOption = { "name": "", "path": "" };

  loadingBackground = false;

  constructor(private backgroundService: BackgroundService) {
    this.backgroundService.background.subscribe((background) => {
      if (background) {
        this.currentBackground = background;
      }
    });
  }

  ngOnInit(): void {
    this.backgroundService.getBackgrounds().subscribe((backgrounds) => {
      this.backgrounds = backgrounds;
    });

    this.backgroundService.getSelectedBackground().then((background) => {
      if (background) {
        this.currentBackground = background;
      }
    });
  }

  originalOrder = () => 0; // disable sorting

  changeBackground(name: string) {
    this.backgroundService.setBackground(name);
  }
}
