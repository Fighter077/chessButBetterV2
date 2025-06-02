// src/app/app-init.factory.ts
import { TranslateService } from '@ngx-translate/core';
import { CookiesService } from './services/cookies/cookies.service';
import { supportedLanguages } from './constants/languages.constants';

export function appInitializerFactory(
  translate: TranslateService,
  cookiesService: CookiesService
): () => Promise<void> {
  return async () => {
    translate.addLangs(supportedLanguages);
    translate.setDefaultLang(supportedLanguages[0]);

    const selectedLanguage = await cookiesService.getCookie('selectedLanguage');

    const langToUse = selectedLanguage ||
      (translate.getBrowserLang()?.match(new RegExp(`^(${supportedLanguages.join('|')})`))?.[0]) ||
      supportedLanguages[0];
    await translate.use(langToUse).toPromise(); // wait until translation JSON is loaded
  };
}
