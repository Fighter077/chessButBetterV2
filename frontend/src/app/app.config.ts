import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SessionInterceptor } from './services/sessionInterceptor.interceptor';

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
    provideHttpClient(withInterceptorsFromDi()),
    {
      'provide': HTTP_INTERCEPTORS,
      'useClass': SessionInterceptor,
      'multi': true
    }
  ]
};
