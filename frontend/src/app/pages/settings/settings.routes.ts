import { Routes } from '@angular/router';

const SettingsMainComponent = () => import('./settings-main/settings-main.component').then(m => m.SettingsMainComponent);
const UserSettingsComponent = () => import('./user-settings/user-settings.component').then(m => m.UserSettingsComponent);
const GamePlaySettingsComponent = () => import('./gameplay-settings/gameplay-settings.component').then(m => m.GameplaySettingsComponent);

export const settingsRoutes: Routes = [
    {
        'path': '',
        'loadComponent': SettingsMainComponent,
        data: { animation: '0-0' }
    },
    {
        'path': 'user',
        'loadComponent': UserSettingsComponent,
        data: { animation: '1-0' }
    },
    {
        'path': 'gameplay',
        'loadComponent': GamePlaySettingsComponent,
        data: { animation: '1-1' }
    }
];
