import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NotificationsEmitterService } from './core/services/notifications.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { of } from 'rxjs';
import { LoaderComponent } from './core/ui/loader/loader.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeaderComponent } from './core/ui/header/header.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notificationsService: NotificationsService;
  let translateService: TranslateService;

  beforeEach(async () => {
    const notificationsEmitterServiceMock = {
      Success: of('Success message'),
      Error: of({ key: 'ErrorKey', message: 'ErrorMessage' }),
      Info: of('Info message'),
    };

    const translateServiceMock = {
      addLangs: jasmine.createSpy('addLangs'),
      setDefaultLang: jasmine.createSpy('setDefaultLang'),
      use: jasmine.createSpy('use'),
      get: jasmine
        .createSpy('get')
        .and.returnValue(of({ MessageKey: 'TranslatedMessage', Success: 'SuccessTranslated' })),
      instant: jasmine.createSpy('instant').and.returnValue('translated'),
    };

    const notificationsServiceMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
    };

    const primeNgConfigMock = {
      setTranslation: jasmine.createSpy('setTranslation'),
    };

    await TestBed.configureTestingModule({
    declarations: [AppComponent],
    imports: [LoaderComponent,
        HeaderComponent,
        RouterOutlet,
        SimpleNotificationsModule.forRoot(),
        ConfirmDialogModule,
        TranslateModule.forRoot()],
    providers: [
        { provide: NotificationsEmitterService, useValue: notificationsEmitterServiceMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: PrimeNGConfig, useValue: primeNgConfigMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: ConfirmationService, useClass: ConfirmationService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    notificationsService = TestBed.inject(NotificationsService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set translate properties on initialization', () => {
    expect(translateService.addLangs).toHaveBeenCalledWith(['bg']);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('bg');
    expect(translateService.use).toHaveBeenCalledWith('bg');
  });

  it('should subscribe to notifications on initialization', () => {
    spyOn(component, 'showNotification');
    spyOn(component, 'handleErrorNotification');
    component.ngOnInit();
    expect(component.showNotification).toHaveBeenCalledWith('Success message', 'Success');
    expect(component.handleErrorNotification).toHaveBeenCalledWith({ key: 'ErrorKey', message: 'ErrorMessage' });
    expect(component.showNotification).toHaveBeenCalledWith('Info message', 'Info');
  });

  it('should show notification', () => {
    component.showNotification('MessageKey', 'Success');
    expect(translateService.get).toHaveBeenCalledWith(['MessageKey', 'Success']);
    expect(notificationsService.success).toHaveBeenCalledWith('SuccessTranslated', 'TranslatedMessage');
  });

  it('should handle error notification', () => {
    spyOn(component, 'tryToTranslateAndShowErrorMessage');
    const error = { key: 'ErrorKey', message: 'ErrorMessage' };
    component.handleErrorNotification(error);
    expect(component.tryToTranslateAndShowErrorMessage).toHaveBeenCalledWith('ErrorKeyErrorMessage');

    const errorWithoutKeyMessage = { key: '', message: '' };
    component.handleErrorNotification(errorWithoutKeyMessage);
    expect(component.tryToTranslateAndShowErrorMessage).toHaveBeenCalledWith(errorWithoutKeyMessage.toString());
  });

  it('should return true if the key contains a space', () => {
    const result = component.hasTranslation('key with space');
    expect(result).toBeTrue();
  });
});
