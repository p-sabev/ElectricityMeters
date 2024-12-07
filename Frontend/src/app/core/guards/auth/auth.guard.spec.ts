import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
      logout: jasmine.createSpy('logout')
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access if user is authenticated and has required role', () => {
    localStorage.setItem('roles', JSON.stringify(['Administrator']));
    const route = new ActivatedRouteSnapshot();
    route.data = { roleNeeded: 'Administrator' };

    expect(authGuard.canActivate(route)).toBeTrue();
  });

  it('should deny access if user is authenticated but does not have required role', () => {
    localStorage.setItem('roles', JSON.stringify(['Administrator']));
    const route = new ActivatedRouteSnapshot();
    route.data = { roleNeeded: 'UnbelievableRole' };

    expect(authGuard.canActivate(route)).toBeFalse();
  });

  it('should navigate to home if user is not authenticated and withoutLogout is set', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);
    localStorage.setItem('withoutLogout', 'true');
    const route = new ActivatedRouteSnapshot();

    authGuard.canActivate(route);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should log out if user is not authenticated and withoutLogout is not set', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);
    localStorage.removeItem('withoutLogout');
    const route = new ActivatedRouteSnapshot();

    authGuard.canActivate(route);
    expect(authService.logout).toHaveBeenCalledWith(true);
  });
});
