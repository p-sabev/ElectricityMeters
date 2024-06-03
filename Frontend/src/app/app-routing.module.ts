import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/ui/home/home.component";
import {NotFoundComponent} from "./core/ui/not-found/not-found.component";
import {LoginComponent} from "./core/authentication/login/login.component";
import {SignupComponent} from "./core/authentication/signup/signup.component";
import {UsersComponent} from "./pages/users/users.component";
import {SubscribersComponent} from "./pages/subscribers/subscribers.component";
import {SwitchboardsComponent} from "./pages/switchboards/switchboards.component";
import {PricesComponent} from "./pages/prices/prices.component";
import {ReadingsComponent} from "./pages/readings/readings.component";

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
    data: { title: 'Потребители' },
  },
  {
    path: 'subscribers',
    component: SubscribersComponent,
    data: { title: 'Абонати' },
  },
  {
    path: 'readings',
    component: ReadingsComponent,
    data: { title: 'Показания' },
  },
  {
    path: 'prices',
    component: PricesComponent,
    data: { title: 'Цени' },
  },
  {
    path: 'electric-meters',
    component: SwitchboardsComponent,
    data: { title: 'Табла' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Вход' },
  },
  {
    path: 'register',
    component: SignupComponent,
    data: { title: 'Регистрация' },
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
