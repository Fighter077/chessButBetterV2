import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private returnUrl: string | null = null;

  setReturnUrl(url: string) {
    this.returnUrl = url;
  }

  getReturnUrl(): string | null {
    return this.returnUrl;
  }

  clearReturnUrl() {
    this.returnUrl = null;
  }
}
