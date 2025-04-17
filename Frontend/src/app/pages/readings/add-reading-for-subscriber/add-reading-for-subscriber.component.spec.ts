import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddReadingForSubscriberComponent } from './add-reading-for-subscriber.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { ReadingsService } from '../readings.service';
import { EventEmitter } from '@angular/core';
import { Subscriber } from '../../../core/models/subscribers.model';
import { Reading } from '../../../core/models/readings.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddReadingForSubscriberComponent', () => {
  let component: AddReadingForSubscriberComponent;
  let fixture: ComponentFixture<AddReadingForSubscriberComponent>;
  let readingsService: jasmine.SpyObj<ReadingsService>;
  let notifications: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  const mockSubscriber: Subscriber = {
    switchboard: { id: 1, name: '1', subscribers: [] },
    id: 1,
    name: 'Test Subscriber',
    lastRecordDate: new Date('2023-01-01T00:00:00.000Z'),
    lastReading: 100,
    defaultReading: 50,
    phaseCount: 1,
    numberPage: 1,
  };

  const mockReading: Reading = {
    id: 1,
    value: 200,
    dateFrom: '2023-01-01T00:00:00.000Z',
    dateTo: '2023-01-31T00:00:00.000Z',
    subscriber: mockSubscriber,
    firstPhaseValue: 0,
    secondPhaseValue: 0,
    thirdPhaseValue: 0,
    amountDue: 0,
    difference: 0,
    currentPrice: 0,
  };

  beforeEach(() => {
    const readingsServiceMock = jasmine.createSpyObj('ReadingsService', ['insertReading', 'editReading']);
    const notificationsMock = jasmine.createSpyObj('NotificationsEmitterService', [], {
      Success: new EventEmitter<string>(),
    });
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);

    TestBed.configureTestingModule({
      imports: [AddReadingForSubscriberComponent, ReactiveFormsModule],
      providers: [
        { provide: ReadingsService, useValue: readingsServiceMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
        { provide: ErrorService, useValue: errorServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReadingForSubscriberComponent);
    component = fixture.componentInstance;

    readingsService = TestBed.inject(ReadingsService) as jasmine.SpyObj<ReadingsService>;
    notifications = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;

    component.subscriber = mockSubscriber;
    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values when no readingToEdit is provided', () => {
    component.readingToEdit = null;
    component.initAddReadingForm();
    const form = component.addEditReadingForm;

    expect(form).toBeDefined();
    expect(form.get('id')?.value).toBeNull();
    expect(form.get('subscriberId')?.value).toBe(mockSubscriber.id);
    expect(form.get('value')?.value).toBeNull();
    expect(form.get('dateFrom')?.value).toEqual(new Date(mockSubscriber.lastRecordDate!));
    expect(form.get('dateTo')?.value).toBeTruthy();
  });

  it('should initialize form with values from readingToEdit when provided', () => {
    component.readingToEdit = mockReading;
    component.initAddReadingForm();
    const form = component.addEditReadingForm;

    expect(form.get('id')?.value).toBe(mockReading.id);
    expect(form.get('subscriberId')?.value).toBe(mockReading.subscriber.id);
    expect(form.get('value')?.value).toBe(mockReading.value);
    expect(form.get('dateFrom')?.value).toEqual(new Date(mockReading.dateFrom));
    expect(form.get('dateTo')?.value).toEqual(new Date(mockReading.dateTo));
  });

  it('should call insertReading on addReading', () => {
    readingsService.insertReading.and.returnValue(of(null));
    spyOn(component.close, 'emit');
    spyOn(notifications.Success, 'emit');

    component.addEditReadingForm.patchValue({
      value: 250,
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-01-31'),
    });

    component.addReading();

    expect(readingsService.insertReading).toHaveBeenCalledWith({
      subscriberId: mockSubscriber.id,
      value: 250,
      firstPhaseValue: 0,
      secondPhaseValue: 0,
      thirdPhaseValue: 0,
      dateFrom: '2023-01-01T00:00:00.000Z',
      dateTo: '2023-01-31T00:00:00.000Z',
    });
    expect(notifications.Success.emit).toHaveBeenCalledWith('SuccessfullyAddedReading');
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should handle error when insertReading fails', () => {
    readingsService.insertReading.and.returnValue(throwError(() => new Error('Error')));
    spyOn(component.close, 'emit');
    spyOn(notifications.Success, 'emit');

    component.addEditReadingForm.patchValue({
      value: 250,
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-01-31'),
    });

    component.addReading();

    expect(errorService.processError).toHaveBeenCalled();
    expect(notifications.Success.emit).not.toHaveBeenCalled();
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should call editReading on editReading', () => {
    readingsService.editReading.and.returnValue(of(null));
    spyOn(component.close, 'emit');
    spyOn(notifications.Success, 'emit');

    component.readingToEdit = mockReading;

    component.addEditReadingForm.patchValue({
      id: mockReading.id,
      subscriberId: mockSubscriber.id,
      value: 300,
      firstPhaseValue: 0,
      secondPhaseValue: 0,
      thirdPhaseValue: 0,
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-01-31'),
    });

    component.editReading();

    expect(readingsService.editReading).toHaveBeenCalledWith({
      id: mockReading.id,
      subscriberId: mockSubscriber.id,
      value: 300,
      dateFrom: '2023-01-01T00:00:00.000Z',
      dateTo: '2023-01-31T00:00:00.000Z',
      firstPhaseValue: 0,
      secondPhaseValue: 0,
      thirdPhaseValue: 0,
    });
    expect(notifications.Success.emit).toHaveBeenCalledWith('SuccessfullyEditedReading');
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should handle error when editReading fails', () => {
    readingsService.editReading.and.returnValue(throwError(() => new Error('Error')));
    spyOn(notifications.Success, 'emit');
    spyOn(component.close, 'emit');

    component.readingToEdit = mockReading;

    component.addEditReadingForm.patchValue({
      value: 300,
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-01-31'),
    });

    component.editReading();

    expect(errorService.processError).toHaveBeenCalled();
    expect(notifications.Success.emit).not.toHaveBeenCalled();
    expect(component.close.emit).not.toHaveBeenCalled();
  });
});
