import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

declare let module: any;

(window as any).global = window;

if (environment.hmr) {  // Check if HMR is enabled
  if (module && (module as any).hot) {
    (module as any).hot.accept();  // Enable HMR for this module
  }
}


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
