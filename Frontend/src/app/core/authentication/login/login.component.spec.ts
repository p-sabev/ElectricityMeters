import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NotificationsEmitterService } from '../../services/notifications.service';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let storageServiceMock: any;
  let routerMock: any;
  let notificationsMock: any;

  beforeEach(() => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({ userId: '123', token: 'token', roles: ['user'] })),
    };
    storageServiceMock = {
      Token: { emit: jasmine.createSpy('emit') },
    };
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };
    notificationsMock = {
      Error: { emit: jasmine.createSpy('emit') },
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login with correct credentials', () => {
    component.loginModel = { email: 'test@example.com', password: 'password' };
    component.logIn();
    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });

  it('should navigate to home page on successful login', () => {
    component.logIn();
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });

  it('should emit error notification on login failure', () => {
    authServiceMock.login.and.returnValue(throwError('error'));
    component.logIn();
    expect(notificationsMock.Error.emit).toHaveBeenCalledWith('IncorrectUserNameOrPassword');
  });

  it('should set user ID, token, and roles in local storage on successful login', () => {
    const userData = { userId: '123', token: 'token', roles: ['user'] };
    component.logUserIntoTheSystem(userData);
    expect(localStorage.getItem('userId')).toBe('123');
    expect(localStorage.getItem('token')).toBe('token');
    expect(localStorage.getItem('roles')).toBe(JSON.stringify(['user']));
  });
});
