import { Routes } from '@angular/router';

const HomeComponent = () => import('./home/home.component').then(m => m.HomeComponent);


export const routes: Routes = [
    {
        'path': '',
        'loadComponent': HomeComponent
    }
];
