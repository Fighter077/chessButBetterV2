import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


if (typeof window !== 'undefined') {
  (window as any).global = window;
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    console.error('Bootstrap error:', err);
    throw err instanceof Error ? err : new Error(JSON.stringify(err));
  });
