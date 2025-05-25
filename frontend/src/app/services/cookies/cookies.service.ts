import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';

declare var gtag: any;

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  cookiesAccepted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  cookiesAccepted: boolean = false;
  preferencesLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  cookiesAcceptedChecked: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  simulatedLocalStorage: { [key: string]: string } = {};

  initiallyChecked: boolean = false;

  cachedPreferences: any | null = null;

  constructor() {
    if (environment.production) {
      import('@capacitor/core').then(({ Capacitor }) => {
        if (Capacitor.isNativePlatform()) {
          this.getPreferences();
        } else {
          this.preferencesLoaded.next(true);
        }
      });
    } else {
      this.preferencesLoaded.next(true);
    }
  }

  async getPreferences(): Promise<any> {
    if (!this.cachedPreferences) {
      const { Preferences } = await import('@capacitor/preferences');
      this.preferencesLoaded.next(true);
      this.cachedPreferences = Preferences;
    }
    return this.cachedPreferences;
  }

  async waitForPreferences(): Promise<void> {
    if (this.preferencesLoaded.getValue()) {
      return;
    }
    await firstValueFrom(this.preferencesLoaded.pipe(filter(loaded => loaded)));
  }

  async onceCookiesAreChecked(): Promise<void> {
    await this.waitForPreferences();
    if (this.cookiesAcceptedChecked.getValue()) {
      return;
    }

    await firstValueFrom(
      this.cookiesAcceptedChecked.pipe(
        filter(checked => checked) // Wait until it emits true
      )
    );
  }

  async setCookie(key: string, value: string): Promise<void> {
    await this.onceCookiesAreChecked();
    if (this.cookiesAccepted) {
      if (this.cachedPreferences) {
        await this.cachedPreferences.set({ key, value });
        return;
      }
      localStorage.setItem(key, value);
      return;
    }
    this.simulatedLocalStorage[key] = value;
  }

  async getCookie(key: string): Promise<string | null> {
    await this.onceCookiesAreChecked();
    if (this.cookiesAccepted) {
      if (this.cachedPreferences) {
        return await this.cachedPreferences.get({ key }).then((res: any) => res.value);
      }
      return localStorage.getItem(key);
    }
    return this.simulatedLocalStorage[key] || null;
  }

  async deleteCookie(key: string): Promise<void> {
    await this.onceCookiesAreChecked();
    if (this.cookiesAccepted) {
      if (this.cachedPreferences) {
        await this.cachedPreferences.remove({ key });
        return;
      }
      localStorage.removeItem(key);
      return;
    }
    delete this.simulatedLocalStorage[key];
  }

  async acceptCookies(): Promise<void> {
    this.cookiesAccepted = true;
    this.cookiesAccepted$.next(true);
    await this.setCookie('cookiesAccepted', 'true');
    for (const key in this.simulatedLocalStorage) {
      if (this.simulatedLocalStorage.hasOwnProperty(key)) {
        await this.setCookie(key, this.simulatedLocalStorage[key]);
      }
    }

    if (environment.production) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NF09EE6YY1';
      script.async = true;

      const firstChild = document.head.firstChild;
      if (firstChild) {
        document.head.insertBefore(script, firstChild);
      } else {
        document.head.appendChild(script);
      }

      // Initialize Google Analytics
      gtag('js', new Date());
      gtag('config', 'G-NF09EE6YY1');
    }

    this.simulatedLocalStorage = {};
  }

  async rejectCookies(): Promise<void> {
    await this.setCookie('cookiesAccepted', 'false');
    this.cookiesAccepted = false;
    this.cookiesAccepted$.next(false);
    this.simulatedLocalStorage = {};
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key !== 'cookiesAccepted') {
        this.simulatedLocalStorage[key] = localStorage.getItem(key) || '';
        localStorage.removeItem(key);
      }
    }
    if (environment.production) {
      // Remove Google Analytics script
      const gaScript = document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=G-NF09EE6YY1"]');
      if (gaScript) {
        gaScript.remove();
      }
    }
    this.cookiesAcceptedChecked.next(true);
    this.initiallyChecked = true;
  }

  async checkCookiesAccepted(): Promise<boolean> {
    await this.waitForPreferences();
    this.cookiesAccepted = this.cookiesAccepted || ((this.cachedPreferences) ? (await this.cachedPreferences.get({ key: 'cookiesAccepted' })).value === 'true' : localStorage.getItem('cookiesAccepted') === 'true');
    this.cookiesAccepted$.next(this.cookiesAccepted);
    this.cookiesAcceptedChecked.next(true);
    if (this.cookiesAccepted && !this.initiallyChecked) {
      this.acceptCookies();
      this.initiallyChecked = true;
    }
    return this.cookiesAccepted;
  }
}
