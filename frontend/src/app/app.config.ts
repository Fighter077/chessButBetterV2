import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { SessionInterceptor } from './services/sessionInterceptor.interceptor';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from './translate-loader';
import { appInitializerFactory } from './app-init.factory';
import { CookiesService } from './services/cookies/cookies.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        'scrollPositionRestoration': 'enabled',
        'anchorScrolling': 'enabled'
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      'provide': HTTP_INTERCEPTORS,
      'useClass': SessionInterceptor,
      'multi': true
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, CookiesService, PLATFORM_ID],
      multi: true,
    }, provideClientHydration(withEventReplay()),
  ]
};
