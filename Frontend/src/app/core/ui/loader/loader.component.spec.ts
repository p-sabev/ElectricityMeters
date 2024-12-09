import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let loaderService: LoaderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent, HttpClientTestingModule],
      providers: [
        { provide: LoaderService, useValue: { loaderState: of({ show: true }) } },
        {
          provide: AuthService,
          useValue: { isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true) },
        },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jasmine.createSpy('detectChanges') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show loader when loaderState is true', () => {
    component.ngOnInit();
    expect(component.show).toBeTrue();
  });

  it('should hide loader when loaderState is false', () => {
    loaderService.loaderState = of({ show: false });
    component.ngOnInit();
    expect(component.show).toBeFalse();
  });

  it('should unsubscribe on destroy', () => {
    const subscription = new Subscription();
    component['subscription'] = subscription;
    spyOn(subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});
