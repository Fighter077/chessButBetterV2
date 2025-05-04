import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  cookiesAccepted: boolean = false;
  simulatedLocalStorage: { [key: string]: string } = {};

  constructor() {}

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
    this.simulatedLocalStorage = {};
  }

  checkCookiesAccepted(): boolean {
    this.cookiesAccepted = this.cookiesAccepted || localStorage.getItem('cookiesAccepted') === 'true';
    return this.cookiesAccepted;
  }
}
