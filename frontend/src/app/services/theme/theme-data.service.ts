import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Theme, ThemeMinimalList } from '../../interfaces/theme';
import { availableThemes } from '../../constants/themes.constants';


@Injectable({
  providedIn: 'root'
})
export class ThemeDataService {
  private themes$!: Observable<ThemeMinimalList>;

  defaultTheme: {'light': Theme, 'dark': Theme } = {'light': availableThemes['light'][0], 'dark': availableThemes['dark'][0]};

  prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

  constructor(private http: HttpClient) { }

  getThemes(): Observable<ThemeMinimalList> {
    if (!this.themes$) {
      this.themes$ = this.http
        .get<ThemeMinimalList>('/assets/themes/themes-minimal.json')
        .pipe(shareReplay(1)); // Cache the result
    }
    return this.themes$;
  }

  setTheme(fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingLink = document.getElementById('theme-link') as HTMLLinkElement;
      const body = document.body;

      body.classList.add('is-transitioning');

      // Create a new <link> element
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = `assets/themes/${fileName}`;
      newLink.id = 'theme-link-temp';

      // When new theme CSS is fully loaded
      newLink.onload = () => {
        // Remove old theme
        if (existingLink) {
          existingLink.remove();
        }

        //save selected theme to local storage
        localStorage.setItem('selectedTheme', fileName);

        // Rename and apply new theme
        newLink.id = 'theme-link';

        setTimeout(() => {
          body.classList.remove('is-transitioning');
          resolve();
        }, 500); // match the CSS transition time
      };

      // Optionally, handle loading error
      newLink.onerror = () => {
        console.error(`Failed to load theme: ${fileName}`);
        body.classList.remove('is-transitioning');
        reject(new Error(`Failed to load theme: ${fileName}`));
      };

      // Append to <head>
      document.head.appendChild(newLink);
    });
  }

  getThemeByFileName(fileName: string): Theme | undefined {
    for (const themeGroup of Object.values(availableThemes)) {
      const theme = themeGroup.find((theme: Theme) => theme.file === fileName);
      if (theme) {
        return theme;
      }
    }
    return undefined;
  }

  getSelectedTheme(): Theme {
    const themeName = localStorage.getItem('selectedTheme');
    if (themeName) {
      const theme = this.getThemeByFileName(themeName);
      if (theme) {
        return theme;
      }
    }
    if (this.prefersDark) {
      return this.defaultTheme.dark;
    }
    return this.defaultTheme.light;
  }

  applySelectedTheme(): void {
    const selectedTheme = this.getSelectedTheme();
    this.setTheme(selectedTheme.file).catch((error) => {
      console.error('Error applying selected theme:', error);
    });
  }
}