import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { timings } from 'src/app/constants/timings.constants';
import { TimingOption, TimingOptions } from 'src/app/interfaces/game';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../../icons/icon.component";
import { expandCollapse } from 'src/app/animations/fade.animation';
import { CookiesService } from 'src/app/services/cookies/cookies.service';

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
export class TimeSelectorComponent implements OnInit {
  @ViewChild('timingSelect') timingSelect!: MatSelect;

  @Output()
  timeSelected: EventEmitter<TimingOption> = new EventEmitter<TimingOption>();

  timingOptions: TimingOptions = timings;

  showOptions: boolean = false; // Controls visibility of timing options

  selectedTimingOption: string | null = '10 min'; // Default to unlimited time
  isTimedGame: boolean = true;

  constructor(private cookiesService: CookiesService) { }

  ngOnInit(): void {
    // Load initial state from cookies
    this.cookiesService.getCookie('isTimedGame').then((isTimed) => {
      this.isTimedGame = isTimed ? isTimed === 'true' : true; // Default to true if not set
      this.cookiesService.getCookie('selectedTimingOption').then((savedTiming) => {
        if (savedTiming) {
          this.selectedTimingOption = savedTiming;
        }
        this.timeSelected.emit(this.findSelectedTimingOption());
      });
    });
  }

  get timingOptionsKeys(): string[] {
    return Object.keys(this.timingOptions);
  }

  onTimedGameChange(event: boolean): void {
    this.cookiesService.setCookie('isTimedGame', event.toString());
    this.showOptions = event;
    this.timeSelected.emit(this.findSelectedTimingOption());
  }

  // Utility: check if a button should appear selected
  isTimingOptionSelected(optionName: string): boolean {
    return this.selectedTimingOption === optionName;
  }

  // Handle selection logic from any button
  selectTimingOption(optionName: string): void {
    this.cookiesService.setCookie('selectedTimingOption', optionName);
    this.selectedTimingOption = optionName;
    this.timeSelected.emit(this.findSelectedTimingOption());
  }

  setSelectOpen(open: boolean): void {
    this.showOptions = open;
  }

  toggleOptions(event: Event): void {
    event.stopPropagation(); // Prevent click from propagating to the select
    event.preventDefault(); // Prevent default action
    this.showOptions = !this.showOptions;
  }

  findSelectedTimingOption(): TimingOption {
    if (!this.isTimedGame) {
      return null;
    }
    for (const key of Object.keys(this.timingOptions)) {
      for (const option of this.timingOptions[key].options) {
        if (option?.name === this.selectedTimingOption) {
          return option;
        }
      }
    }
    return null;
  }
}
