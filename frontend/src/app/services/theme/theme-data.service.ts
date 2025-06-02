import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, first, firstValueFrom, Observable, shareReplay, tap } from 'rxjs';
import { Theme, ThemeMinimal, ThemeMinimalList } from '../../interfaces/theme';
import { availableThemes } from '../../constants/themes.constants';
import { CookiesService } from '../cookies/cookies.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ThemeDataService {
  private themes$!: Observable<ThemeMinimalList>;
  private theme: BehaviorSubject<ThemeMinimal | null> = new BehaviorSubject<ThemeMinimal | null>(null);

  defaultTheme: { 'light': Theme, 'dark': Theme } = { 'light': availableThemes['light'][0], 'dark': availableThemes['dark'][0] };

  prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

  statusBar: any;
  navigationBar: any;
  style: any;
  edgeToEdge: any;


  constructor(@Inject(HttpClient) private http: HttpClient, private cookiesService: CookiesService) {
    Promise.all([
      this.getThemes().toPromise(),
      this.getSelectedTheme()
    ]).then(([themes, selectedTheme]) => {
      if (themes) {
        this.theme.next(themes[selectedTheme.file]);
      }
    });

    if (environment.production) {
      import('@capacitor/core').then(({ Capacitor }) => {
        if (Capacitor.isNativePlatform()) {
          Promise.all([
            import('@capacitor/status-bar'),
            import('@capawesome/capacitor-android-edge-to-edge-support'),
            import('@capgo/capacitor-navigation-bar')
          ]).then(async ([{ StatusBar, Style }, { EdgeToEdge }, { NavigationBar }]) => {
            this.statusBar = StatusBar;
            this.style = Style;
            this.edgeToEdge = EdgeToEdge;
            this.navigationBar = NavigationBar;

            this.statusBar.setOverlaysWebView({ overlay: false });
            this.edgeToEdge.setEnabled({ enabled: true });

            this.theme.subscribe((theme: ThemeMinimal | null) => {
              if (theme) {
                this.setStatusBarStyle(theme);
              }
            });
            const currentTheme = this.theme.getValue() || await firstValueFrom(this.theme);
            if (currentTheme) {
              this.setStatusBarStyle(currentTheme);
            }
          });
        }
      });
    }
  }

  setStatusBarStyle(theme: ThemeMinimal): void {
    if (this.statusBar && this.style && this.edgeToEdge && this.navigationBar) {
      this.statusBar.setBackgroundColor({ color: theme.secondary });
      this.statusBar.setStyle({ style: theme.style === 'dark' ? this.style.Dark : this.style.Light });
      this.edgeToEdge.enable();
      this.edgeToEdge.setBackgroundColor({ color: theme.secondary });
      this.navigationBar.setNavigationBarColor({ color: theme.background, darkButtons: theme.style === 'light' });
    }
  }

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
      this.cookiesService.setCookie('selectedTheme', fileName);

      
      const body = document.body;
      //clear existing theme classes
      body.classList.forEach((className) => {
        if (className.startsWith('theme-')) {
          body.classList.remove(className);
        }
      });
      body.classList.add('is-transitioning');
      body.classList.add(`theme-${fileName.split('.')[0]}`);
      setTimeout(() => {
        body.classList.remove('is-transitioning');
        resolve();
      }, 500); // match the CSS transition time

      /*
      const existingLink = document.getElementById('theme-link') as HTMLLinkElement;
      const body = document.body;


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
        this.cookiesService.setCookie('selectedTheme', fileName);

        // Rename and apply new theme
        newLink.id = 'theme-link';

        this.getThemes().pipe(
          tap((themes: ThemeMinimalList) => {
            const selectedTheme = themes[fileName.split('.')[0]];
            if (selectedTheme) {
              this.theme.next(selectedTheme);
            } else {
              console.error(`Theme not found: ${fileName}`, themes);
            }
          }),
          first()
        ).subscribe();

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
      */
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

  async getSelectedTheme(): Promise<Theme> {
    const themeName = await this.cookiesService.getCookie('selectedTheme');
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
    this.getSelectedTheme().then(selectedTheme => {
      this.setTheme(selectedTheme.file).catch((error) => {
        console.error('Error applying selected theme:', error);
      });
    });
  }
}