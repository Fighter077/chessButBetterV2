import { Routes } from '@angular/router';

// Lazy load the Page components to improve initial load time
const HomeComponent = () => import('./pages/home/home.component').then(m => m.HomeComponent);
const SettingsComponent = () => import('./pages/settings/settings.component').then(m => m.SettingsComponent);


export const routes: Routes = [
    {
        'path': '',
        'loadComponent': HomeComponent,
        data: { animation: 'HomePage' }
    },
    {
        'path': 'settings',
        'loadComponent': SettingsComponent,
        data: { animation: 'SettingsPage' }
    },
];
