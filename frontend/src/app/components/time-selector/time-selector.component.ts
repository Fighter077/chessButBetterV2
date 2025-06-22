import { Component, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { timings } from 'src/app/constants/timings.constants';
import { TimingOptions } from 'src/app/interfaces/game';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../../icons/icon.component";
import { expandCollapse } from 'src/app/animations/fade.animation';

@Component({
  animations: [expandCollapse('vertical', 0, 'both', 150)],
  selector: 'app-time-selector',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonToggleModule,
    IconComponent
  ],
  templateUrl: './time-selector.component.html',
  styleUrl: './time-selector.component.scss'
})
export class TimeSelectorComponent {
  @ViewChild('timingSelect') timingSelect!: MatSelect;

  timingOptions: TimingOptions = timings;

  showOptions: boolean = false; // Controls visibility of timing options

  selectedTimingOption: string | null = '10 min'; // Default to unlimited time
  isTimedGame: boolean = true;

  get timingOptionsKeys(): string[] {
    return Object.keys(this.timingOptions);
  }

  onTimedGameChange(event: boolean): void {
    this.showOptions = event;
  }

  // Utility: check if a button should appear selected
  isTimingOptionSelected(optionName: string): boolean {
    return this.selectedTimingOption === optionName;
  }

  // Handle selection logic from any button
  selectTimingOption(optionName: string): void {
    this.selectedTimingOption = optionName;
  }

  setSelectOpen(open: boolean): void {
    this.showOptions = open;
  }

  toggleOptions(event: Event): void {
    event.stopPropagation(); // Prevent click from propagating to the select
    event.preventDefault(); // Prevent default action
    this.showOptions = !this.showOptions;
  }
}
