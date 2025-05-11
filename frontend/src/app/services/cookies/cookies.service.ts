import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare var gtag : any;


@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  cookiesAccepted: boolean = false;
  simulatedLocalStorage: { [key: string]: string } = {};

  constructor() { }

  setCookie(key: string, value: string): void {
    if (this.cookiesAccepted) {
      localStorage.setItem(key, value);
      return;
    }
    this.simulatedLocalStorage[key] = value;
  }

  getCookie(key: string): string | null {
    if (this.cookiesAccepted) {
      return localStorage.getItem(key);
    }
    return this.simulatedLocalStorage[key] || null;
  }

  deleteCookie(key: string): void {
    if (this.cookiesAccepted) {
      localStorage.removeItem(key);
      return;
    }
    delete this.simulatedLocalStorage[key];
  }

  acceptCookies(): void {
    this.cookiesAccepted = true;
    localStorage.setItem('cookiesAccepted', 'true');
    for (const key in this.simulatedLocalStorage) {
      if (this.simulatedLocalStorage.hasOwnProperty(key)) {
        localStorage.setItem(key, this.simulatedLocalStorage[key]);
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

  checkCookiesAccepted(): boolean {
    this.cookiesAccepted = this.cookiesAccepted || localStorage.getItem('cookiesAccepted') === 'true';
    if (this.cookiesAccepted) {
      this.acceptCookies();
    }
    return this.cookiesAccepted;
  }
}
