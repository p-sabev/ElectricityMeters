import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { SignupComponent } from './core/authentication/signup/signup.component';
import { RestorePasswordComponent } from './core/authentication/restore-password/restore-password.component';
import { FooterComponent } from './core/ui/footer/footer.component';
import { LoaderComponent } from './core/ui/loader/loader.component';
import { MenuComponent } from './core/ui/menu/menu.component';
import { NotFoundComponent } from './core/ui/not-found/not-found.component';
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TabViewModule} from "primeng/tabview";
import {ButtonModule} from "primeng/button";
import { TreeModule } from 'primeng/tree';
import {ComingSoonComponent} from "./pages/coming-soon/coming-soon.component";
import {SharedModule} from "./shared/shared/shared.module";
import {LoaderInterceptorService} from "./core/interceptors/loader-interceptor.service";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {SimpleNotificationsModule} from "angular2-notifications";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {HeaderComponent} from "./core/ui/header/header.component";
import {TokenInterceptor} from "./core/interceptors/token-interceptor.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    RestorePasswordComponent,
    FooterComponent,
    LoaderComponent,
    MenuComponent,
    NotFoundComponent,
    ComingSoonComponent,
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
