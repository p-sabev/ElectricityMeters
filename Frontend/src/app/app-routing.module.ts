import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/ui/home/home.component";
import {NotFoundComponent} from "./core/ui/not-found/not-found.component";
import {LoginComponent} from "./core/authentication/login/login.component";
import {UsersComponent} from "./pages/users/users.component";
import {SubscribersComponent} from "./pages/subscribers/subscribers.component";
import {SwitchboardsComponent} from "./pages/switchboards/switchboards.component";
import {PricesComponent} from "./pages/prices/prices.component";
import {ReadingsComponent} from "./pages/readings/readings.component";
import {PaymentsComponent} from "./pages/payments/payments.component";
import {SettingsComponent} from "./pages/settings/settings.component";
import {AuthGuard} from "./core/guards/auth/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Ел-рекърд' },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Ел-рекърд' },
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { title: 'Потребители', roleNeeded: 'Administrator' },
    canActivate: [AuthGuard]
  },
  {
    path: 'subscribers',
    component: SubscribersComponent,
    data: { title: 'Абонати', roleNeeded: 'Administrator, Moderator' },
    canActivate: [AuthGuard]
  },
  {
    path: 'readings',
    component: ReadingsComponent,
    data: { title: 'Показания', roleNeeded: 'Administrator, Moderator, Basic' },
    canActivate: [AuthGuard]
  },
  {
    path: 'prices',
    component: PricesComponent,
    data: { title: 'Цени', roleNeeded: 'Administrator, Moderator' },
    canActivate: [AuthGuard]
  },
  {
    path: 'electric-meters',
    component: SwitchboardsComponent,
    data: { title: 'Табла', roleNeeded: 'Administrator, Moderator, Basic' },
    canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    data: { title: 'Плащания', roleNeeded: 'Administrator, Moderator' },
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: { title: 'Настройки', roleNeeded: 'Administrator, Moderator' },
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Вход' },
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { title: 'Страницата не бе намерена' },
  },
  {
    path: '**',
    redirectTo: '/not-found',
    data: { title: 'Страницата не бе намерена' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
