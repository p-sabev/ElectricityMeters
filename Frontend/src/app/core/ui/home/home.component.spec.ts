import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withRouterConfig } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      declarations: [],
      providers: [
        provideRouter([], withRouterConfig({})),
        { provide: AuthService, useValue: { isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not authenticated on init', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should not navigate to login if authenticated on init', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the specified route on openRoute', () => {
    const route = 'some-route';
    component.openRoute(route);
    expect(router.navigate).toHaveBeenCalledWith([route]);
  });
});
