import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private returnUrl: string | null = null;
  private returnParams: { [key: string]: any } | null = null;

  setReturnUrl(url: string) {
    this.returnUrl = url;
  }

  setReturnParams(params: { [key: string]: any }) {
    this.returnParams = params;
  }

  getReturnUrl(): string | null {
    return this.returnUrl;
  }

  getReturnParams(): { [key: string]: any } | null {
    return this.returnParams;
  }

  clearReturnUrl() {
    this.returnUrl = null;
    this.returnParams = null;
  }
}
