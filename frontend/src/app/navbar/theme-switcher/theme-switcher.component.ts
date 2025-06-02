// Angular imports
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
// Angular Material imports
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatOptgroup } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
// Component imports
import { ThemeDisplayComponent } from './theme-display/theme-display.component';
import { fadeInOut } from '../../animations/fade.animation';
import { availableThemes } from '../../constants/themes.constants';
import { Theme, ThemeList } from '../../interfaces/theme';
import { ThemeDataService } from '../../services/theme/theme-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-theme-switcher',
	imports: [
		// Angular imports
		CommonModule,
		FormsModule,
		// Angular Material imports
		MatFormField,
		MatLabel,
		MatSelect,
		MatOptgroup,
		MatOption,
		MatProgressSpinner,
		MatCheckboxModule,
		// Component imports
		ThemeDisplayComponent,
		TranslateModule
	],
	templateUrl: './theme-switcher.component.html',
	styleUrl: './theme-switcher.component.scss',
	animations: [fadeInOut()]
})
export class ThemeSwitcherComponent implements OnInit {
	constructor(private themeData: ThemeDataService) { }
	themes: ThemeList = availableThemes;

	currentTheme: string = this.themes['dark'][0].file;;

	loadingTheme = false;

	ngOnInit(): void {
		this.themeData.getSelectedTheme().then((theme: Theme) => {
			this.currentTheme = theme.file;
		});
	}

	originalOrder = () => 0; // disable sorting

	changeTheme(fileName: string) {
		// Set loading state
		this.loadingTheme = true;

		this.themeData.setTheme(fileName).then(() => {
			// Reset loading state
			this.loadingTheme = false;
			// Update current theme
			this.currentTheme = fileName;
		}).catch((error: Error) => {
			console.error('Error loading theme:', error);
			// Reset loading state
			this.loadingTheme = false;
		});
	}
}