// src/app/app-init.factory.ts
import { TranslateService } from '@ngx-translate/core';
import { CookiesService } from './services/cookies/cookies.service';
import { supportedLanguages } from './constants/languages.constants';
import { environment } from 'src/environments/environment';

export function appInitializerFactory(
  translate: TranslateService,
  cookiesService: CookiesService
): () => Promise<void> {
  return async () => {
    if (environment.production) {
      // Setup function that could send data to Google Analytics
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
      `;
      const firstChild = document.head.firstChild;
      if (firstChild) {
        document.head.insertBefore(script2, firstChild);
      } else {
        document.head.appendChild(script2);
      }
    }
    translate.addLangs(supportedLanguages);
    translate.setDefaultLang(supportedLanguages[0]);

    const selectedLanguage = await cookiesService.getCookie('selectedLanguage');

    const langToUse = selectedLanguage ||
      (translate.getBrowserLang()?.match(new RegExp(`^(${supportedLanguages.join('|')})`))?.[0]) ||
      supportedLanguages[0];
    await translate.use(langToUse).toPromise(); // wait until translation JSON is loaded
  };
}
