import {Routes} from '@angular/router';
import {HomeComponent} from './core/ui/home/home.component';
import {NotFoundComponent} from './core/ui/not-found/not-found.component';
import {LoginComponent} from './core/authentication/login/login.component';
import {UsersComponent} from './pages/users/users.component';
import {SubscribersComponent} from './pages/subscribers/subscribers.component';
import {SwitchboardsComponent} from './pages/switchboards/switchboards.component';
import {PricesComponent} from './pages/prices/prices.component';
import {ReadingsComponent} from './pages/readings/readings.component';
import {PaymentsComponent} from './pages/payments/payments.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {AuthGuard} from './core/guards/auth/auth.guard';

export const appRoutes: Routes = [
  {path: '', component: HomeComponent, data: {title: 'Ел-рекърд'}},
  {path: 'home', component: HomeComponent, data: {title: 'Ел-рекърд'}},
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
    data: {title: 'Потребители', roleNeeded: 'Administrator'},
    canActivate: [AuthGuard]
  },
  {
    path: 'subscribers',
    loadComponent: () => import('./pages/subscribers/subscribers.component').then(m => m.SubscribersComponent),
    data: {title: 'Абонати', roleNeeded: 'Administrator, Moderator'},
    canActivate: [AuthGuard]
  },
  {
    path: 'readings',
    loadComponent: () => import('./pages/readings/readings.component').then(m => m.ReadingsComponent),
    data: {title: 'Показания', roleNeeded: 'Administrator, Moderator, Basic'},
    canActivate: [AuthGuard]
  },
  {
    path: 'prices',
    loadComponent: () => import('./pages/prices/prices.component').then(m => m.PricesComponent),
    data: {title: 'Цени', roleNeeded: 'Administrator, Moderator'},
    canActivate: [AuthGuard]
  },
  {
    path: 'electric-meters',
    loadComponent: () => import('./pages/switchboards/switchboards.component').then(m => m.SwitchboardsComponent),
    data: {title: 'Табла', roleNeeded: 'Administrator, Moderator, Basic'},
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent),
    data: {title: 'Плащания', roleNeeded: 'Administrator, Moderator'},
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    data: {title: 'Настройки', roleNeeded: 'Administrator, Moderator'},
    canActivate: [AuthGuard]
  },
  {path: 'login', component: LoginComponent, data: {title: 'Вход'}},
  {path: 'not-found', component: NotFoundComponent, data: {title: 'Страницата не бе намерена'}},
  {path: '**', redirectTo: '/not-found', data: {title: 'Страницата не бе намерена'}},
];
