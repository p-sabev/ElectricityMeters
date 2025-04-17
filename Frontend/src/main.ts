import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SimpleNotificationsModule, NotificationsService, Options } from 'angular2-notifications';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { appRoutes } from './app/app.routes';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { AuthGuard } from './app/core/guards/auth/auth.guard';
import { loaderInterceptor } from './app/core/interceptors/loader/loader-interceptor.interceptor';
import { tokenInterceptor } from './app/core/interceptors/token/token-interceptor.interceptor';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

const fontAwesomeLibrary = new FaIconLibrary();
fontAwesomeLibrary.addIconPacks(fas, far);

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([loaderInterceptor, tokenInterceptor])),
    provideRouter(appRoutes),
    // provideServiceWorker('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   registrationStrategy: 'registerWhenStable:30000',
    // }),
    AuthGuard,
    NotificationsService,
    ConfirmationService,
    PrimeNGConfig,
    {
      provide: 'options',
      useValue: {
        position: ['bottom', 'right'],
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        lastOnBottom: true,
        maxLength: 0,
      } as Options,
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      SimpleNotificationsModule
    ),
    { provide: FaIconLibrary, useValue: fontAwesomeLibrary },
  ],
});
