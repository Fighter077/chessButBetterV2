import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Theme, ThemeMinimal, ThemeMinimalList } from '../../../interfaces/theme';
import { ThemeDataService } from '../../../services/theme/theme-data.service';
import { removeFileExtension } from '../../../utils/file.utils';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IconComponent } from '../../../icons/icon.component';
import { ErrorComponent } from '../../../icons/error/error.component';

@Component({
  selector: 'app-theme-display',
  standalone: true,
  imports: [
    CommonModule,
    // Angular Material imports
    MatProgressSpinner,
    IconComponent,
    ErrorComponent
  ],
  templateUrl: './theme-display.component.html',
  styleUrl: './theme-display.component.scss'
})
export class ThemeDisplayComponent implements OnInit {
  @Input() theme: Theme = { name: '', file: '' };
  themeMinimal: ThemeMinimal = {
    background: '',
    text: '',
    primary: '',
    secondary: ''
  };

  loading = true;
  error = false;

  constructor(private themeData: ThemeDataService) {}

  ngOnInit(): void {
    this.themeData.getThemes().subscribe((themes: ThemeMinimalList) => {
      this.loading = false;
      
      const parsedName = removeFileExtension(this.theme.file);

      const newTheme = themes[parsedName];
      if (!newTheme) {
        console.error(`Theme ${this.theme.name} not found`);
      } else {
        this.themeMinimal = newTheme;
        this.error = false;
      }
    });
  }
}
