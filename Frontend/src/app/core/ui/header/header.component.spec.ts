import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from './header.component';
import { of } from 'rxjs';
import { NavigationEnd, provideRouter, Router, withRouterConfig } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let titleService: Title;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      declarations: [],
      providers: [
        provideRouter([], withRouterConfig({})),
        { provide: AuthService, useValue: { logout: jasmine.createSpy('logout') } },
        { provide: Title, useValue: { setTitle: jasmine.createSpy('setTitle') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should collapse menu by default', () => {
    expect(component.collapseMenu).toBeTrue();
  });

  it('should set title on navigation end', () => {
    spyOn(router.events, 'pipe').and.returnValue(of(new NavigationEnd(0, '', '')));
    spyOn(component, 'subscribeToChangesInPage').and.callThrough();

    component.ngOnInit();
    expect(component.subscribeToChangesInPage).toHaveBeenCalled();
    expect(titleService.setTitle).toHaveBeenCalled();
  });

  it('should call logout on logOut method', () => {
    component.logOut();
    expect(authService.logout).toHaveBeenCalledWith(true);
  });
});
