import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// Lazy load the Page components to improve initial load time
const HomeComponent = () => import('./pages/home/home.component').then(m => m.HomeComponent);
const SettingsComponent = () => import('./pages/settings/settings.component').then(m => m.SettingsComponent);
const PrivacyPolicyComponent = () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent);
const PlayComponent = () => import('./pages/play/play.component').then(m => m.PlayComponent);
const LicensesComponent = () => import('./pages/licenses/licenses.component').then(m => m.LicensesComponent);


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
    {
        'path': 'privacy-policy',
        'loadComponent': PrivacyPolicyComponent,
        data: { animation: 'PrivacyPolicyPage' }
    },
    {
        'path': 'play',
        'loadComponent': PlayComponent,
        canActivate: [authGuard],
        data: {
            roles: ['ADMIN', 'USER', 'TEMP_USER'],
            animation: 'PlayPage'
        }
    },
    {
        'path': 'game/:gameID',
        'loadComponent': PlayComponent,
        data: { animation: 'GamePage' }
    },
    {
        'path': 'licenses',
        'loadComponent': LicensesComponent,
        data: { animation: 'LicensesPage' }
    },
    {
        'path': '**',
        redirectTo: ''
    }
];
