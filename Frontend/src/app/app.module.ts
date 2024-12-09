import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { LoaderComponent } from './core/ui/loader/loader.component';
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TabViewModule} from "primeng/tabview";
import {ButtonModule} from "primeng/button";
import { TreeModule } from 'primeng/tree';
import {SharedModule} from "./shared/shared/shared.module";
import {LoaderInterceptorService} from "./core/interceptors/loader/loader-interceptor.service";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {SimpleNotificationsModule} from "angular2-notifications";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {HeaderComponent} from "./core/ui/header/header.component";
import {TokenInterceptor} from "./core/interceptors/token/token-interceptor.interceptor";
import { ServiceWorkerModule } from '@angular/service-worker';
import {AuthGuard} from "./core/guards/auth/auth.guard";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    SharedModule,
    FontAwesomeModule,
    HttpClientModule,
    TabViewModule,
    ButtonModule,
    TreeModule,
    ConfirmDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LoaderComponent,
    HeaderComponent
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    AuthGuard
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(fasLibrary: FaIconLibrary) {
    fasLibrary.addIconPacks(fas, far);
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
