import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddReadingForSwitchboardComponent } from './add-reading-for-switchboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { ReadingsService } from '../readings.service';
import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscriber } from '../../../core/models/subscribers.model';

describe('AddReadingForSwitchboardComponent', () => {
  let component: AddReadingForSwitchboardComponent;
  let fixture: ComponentFixture<AddReadingForSwitchboardComponent>;
  let readingsService: jasmine.SpyObj<ReadingsService>;
  let notifications: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  const mockSubscribers: Subscriber[] = [
    {
      id: 1,
      name: 'Subscriber 1',
      phaseCount: 1,
      lastRecordDate: new Date('2023-01-01T00:00:00.000Z'),
      lastReading: 100,
      defaultReading: 50,
      numberPage: 0,
      switchboard: { id: 1, name: '1' },
    },
    {
      id: 2,
      name: 'Subscriber 2',
      phaseCount: 3,
      lastRecordDate: new Date('2023-02-01T00:00:00.000Z'),
      lastReading: 200,
      defaultReading: 150,
      numberPage: 0,
      switchboard: { id: 1, name: '1' },
    },
  ];

  beforeEach(() => {
    const readingsServiceMock = jasmine.createSpyObj('ReadingsService', ['insertReadingsForSubscribers']);
    const notificationsMock = jasmine.createSpyObj('NotificationsEmitterService', [], {
      Success: new EventEmitter<string>(),
      Info: new EventEmitter<string>(),
    });
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);
    const translateServiceMock = jasmine.createSpyObj('TranslateService', ['instant']);

    TestBed.configureTestingModule({
      imports: [AddReadingForSwitchboardComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ReadingsService, useValue: readingsServiceMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReadingForSwitchboardComponent);
    component = fixture.componentInstance;

    readingsService = TestBed.inject(ReadingsService) as jasmine.SpyObj<ReadingsService>;
    notifications = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    component.subscribers = mockSubscribers;
    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values in setInitialValues', () => {
    component.setInitialValues();
    expect(component.readingsValues.length).toBe(mockSubscribers.length);
    expect(component.readingsValues[0]).toBeNull();
  });

  it('should calculate reading value for one phase', () => {
    component.readingsValues = [150];
    const value = component.calculateReadingValue(mockSubscribers[0], 0);
    expect(value).toBe(150);
  });

  it('should calculate reading value for three phases', () => {
    component.firstPhaseValues = [100];
    component.secondPhaseValues = [80];
    component.thirdPhaseValues = [70];
    const value = component.calculateReadingValue(mockSubscribers[1], 0);
    expect(value).toBe(250);
  });

  it('should create a reading entry', () => {
    const entry = component.createReadingEntry(mockSubscribers[0], 150, 0);
    expect(entry).toEqual({
      subscriberId: mockSubscribers[0].id,
      dateFrom: jasmine.any(String),
      dateTo: jasmine.any(String),
      value: 150,
      firstPhaseValue: 0,
      secondPhaseValue: 0,
      thirdPhaseValue: 0,
    });
  });

  it('should add readings successfully', () => {
    readingsService.insertReadingsForSubscribers.and.returnValue(of(null));
    spyOn(component.close, 'emit');
    spyOn(notifications.Success, 'emit');

    component.readingsValues = [150, 200];
    component.addReadings();

    expect(readingsService.insertReadingsForSubscribers).toHaveBeenCalled();
    expect(notifications.Success.emit).toHaveBeenCalledWith('SuccessfullyAddedReadings');
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not add readings if no values are provided', () => {
    spyOn(notifications.Info, 'emit');

    // @ts-expect-error Testing private method
    component.readingsValues = [null, null];
    component.addReadings();

    expect(notifications.Info.emit).toHaveBeenCalledWith('NoReadingsToInsert');
    expect(readingsService.insertReadingsForSubscribers).not.toHaveBeenCalled();
  });

  it('should handle error when adding readings fails', () => {
    readingsService.insertReadingsForSubscribers.and.returnValue(throwError(() => new Error('Error')));
    spyOn(notifications.Success, 'emit');
    spyOn(component.close, 'emit');

    component.readingsValues = [150, 200];
    component.addReadings();

    expect(errorService.processError).toHaveBeenCalled();
    expect(notifications.Success.emit).not.toHaveBeenCalled();
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should handle invalid values in getBodyToInsertReadings', () => {
    spyOn(notifications.Info, 'emit');
    translateService.instant.and.returnValue('SubscriberReadingValueIsLowerThanLastReading');

    component.readingsValues = [90]; // Lower than lastReading
    const body = component.getBodyToInsertReadings();

    expect(body).toBeNull();
    expect(notifications.Info.emit).toHaveBeenCalledWith('SubscriberReadingValueIsLowerThanLastReading');
  });
});
