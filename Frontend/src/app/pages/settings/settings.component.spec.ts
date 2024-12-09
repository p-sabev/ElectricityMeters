import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { SettingsService } from './settings.service';
import { ErrorService } from '../../core/services/error.service';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { of, throwError } from 'rxjs';
import { DefaultFee } from '../../core/models/settings.model';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {EventEmitter} from "@angular/core";

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: jasmine.SpyObj<SettingsService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let notifications: jasmine.SpyObj<NotificationsEmitterService>;

  const mockFeeList: DefaultFee[] = [
    { description: 'Fee 1', value: 50 },
    { description: 'Fee 2', value: 100 },
  ];

  beforeEach(async () => {
    const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['getDefaultFees', 'updateDefaultFees']);
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);
    const notificationsMock = jasmine.createSpyObj('NotificationsEmitterService', [], {
      Success: new EventEmitter<string>(),
      Info: new EventEmitter<string>(),
    });

    settingsServiceMock.getDefaultFees.and.returnValue(of(mockFeeList));
    settingsServiceMock.updateDefaultFees.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [
        SettingsComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
      ],
    }).compileComponents();

    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faTrash, faPlus);

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;

    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    notifications = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch default fees on initialization', () => {
    component.ngOnInit();

    expect(settingsService.getDefaultFees).toHaveBeenCalled();
    expect(component.feeList).toEqual(mockFeeList);
    expect(component.loadedFees).toBeTrue();
    expect(component.noFeesAdded).toBeFalse();
    expect(component.feesChanged).toBeFalse();
  });

  it('should handle error when fetching default fees fails', () => {
    settingsService.getDefaultFees.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(settingsService.getDefaultFees).toHaveBeenCalled();
    expect(errorService.processError).toHaveBeenCalled();
  });

  it('should update fees successfully', () => {
    component.feeList = mockFeeList;
    component.updateFees();

    expect(settingsService.updateDefaultFees).toHaveBeenCalled();
    expect(component.feesChanged).toBeFalse();
  });

  it('should handle error when updating fees fails', () => {
    settingsService.updateDefaultFees.and.returnValue(throwError(() => new Error('Error')));

    component.feeList = mockFeeList;
    component.updateFees();

    expect(settingsService.updateDefaultFees).toHaveBeenCalled();
    expect(errorService.processError).toHaveBeenCalled();
  });

  it('should delete a fee and mark fees as changed', () => {
    component.feeList = [...mockFeeList];
    const initialLength = component.feeList.length;

    component.deleteFee(0);

    expect(component.feeList.length).toBe(initialLength - 1);
    expect(component.feesChanged).toBeTrue();
  });

  it('should set noFeesAdded to true if all fees are deleted', () => {
    component.feeList = [...mockFeeList];

    component.deleteFee(0);
    component.deleteFee(0); // Delete the remaining fee

    expect(component.feeList.length).toBe(0);
    expect(component.noFeesAdded).toBeTrue();
  });
});
