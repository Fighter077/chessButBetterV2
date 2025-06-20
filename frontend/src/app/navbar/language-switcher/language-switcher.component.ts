import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [
    // Angular imports
    CommonModule,
    FormsModule,
    // Angular Material imports
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatProgressSpinner,
    TranslateModule
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {

  languages: { code: string, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
  ];

  selectableLanguages: { code: string, name: string }[] = [];

  loadingLanguage: boolean = false;

	originalOrder = () => 0; // disable sorting

  selectedLanguage = this.languages[0].code; // Default to English

  constructor(private translateService: TranslateService) {
    // Set the default language for the application
    this.translateService.getLangs().forEach(lang => {
      this.selectableLanguages.push(this.languages.find(l => l.code === lang) || { code: lang, name: lang });
    });

    this.selectedLanguage = this.translateService.currentLang;

    this.translateService.onLangChange.subscribe((event) => {
      this.selectedLanguage = event.lang;
      this.loadingLanguage = false;
    });
  }

  changeLanguage(languageCode: string) {
    this.loadingLanguage = true;
    this.translateService.use(languageCode).subscribe(() => {
      this.loadingLanguage = false;
    });
  }
}
