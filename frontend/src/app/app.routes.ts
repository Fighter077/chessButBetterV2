import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { langMatcher } from './lang-route.matcher';

import { LanguageRedirectComponent } from './pages/language-redirect/language-redirect.component';
import { settingsRoutes } from './pages/settings/settings.routes';

// Lazy load the Page components to improve initial load time
const HomeComponent = () => import('./pages/home/home.component').then(m => m.HomeComponent);
const SettingsComponent = () => import('./pages/settings/settings.component').then(m => m.SettingsComponent);
const PrivacyPolicyComponent = () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent);
const PlayComponent = () => import('./pages/play/play.component').then(m => m.PlayComponent);
const LicensesComponent = () => import('./pages/licenses/licenses.component').then(m => m.LicensesComponent);
const AboutComponent = () => import('./pages/about/about.component').then(m => m.AboutComponent);
const OAuthComponent = () => import('./pages/oauth/oauth.component').then(m => m.OauthComponent);


export const routes: Routes = [
    {
        matcher: langMatcher,
        component: LanguageRedirectComponent,
    },
    {
        'path': '',
        'loadComponent': HomeComponent,
        data: { animation: 'HomePage' }
    },
    {
        'path': 'settings',
        'loadComponent': SettingsComponent,
        data: { animation: 'SettingsPage' },
        children: settingsRoutes
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
        'path': 'about',
        'loadComponent': AboutComponent,
        data: { animation: 'AboutPage' }
    },
    {
        'path': 'login/:state',
        'loadComponent': OAuthComponent,
        data: { animation: 'OAuthPage' }
    },
    {
        'path': '**',
        redirectTo: ''
    }
];
