import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetailsForSubscriberComponent } from './details-for-subscriber.component';
import { ReadingsService } from '../../readings/readings.service';
import { of, throwError } from 'rxjs';
import { Subscriber } from '../../../core/models/subscribers.model';
import { Reading } from '../../../core/models/readings.model';
import { TranslateModule } from '@ngx-translate/core';

describe('DetailsForSubscriberComponent', () => {
  let component: DetailsForSubscriberComponent;
  let fixture: ComponentFixture<DetailsForSubscriberComponent>;
  let readingsService: jasmine.SpyObj<ReadingsService>;

  const mockSubscriber: Subscriber = {
    id: 1,
    name: 'John Doe',
    numberPage: 2,
    address: '123 Main St',
    phone: '555-5555',
    meterNumber: 'ABC123',
    note: 'Test Subscriber',
    defaultReading: 100,
    phaseCount: 3,
    switchboard: { id: 1, name: 'Main Switchboard' },
  };

  const mockReadings: Reading[] = [
    {
      id: 1,
      subscriber: mockSubscriber,
      dateFrom: '2023-01-01',
      dateTo: '2023-02-01',
      value: 150,
      firstPhaseValue: 50,
      secondPhaseValue: 50,
      thirdPhaseValue: 50,
      amountDue: 75,
      difference: 50,
      currentPrice: 1.5,
      isPaid: false,
      feeList: [],
    },
    {
      id: 2,
      subscriber: mockSubscriber,
      dateFrom: '2023-02-01',
      dateTo: '2023-03-01',
      value: 180,
      firstPhaseValue: 60,
      secondPhaseValue: 60,
      thirdPhaseValue: 60,
      amountDue: 90,
      difference: 30,
      currentPrice: 1.5,
      isPaid: true,
      feeList: [],
    },
  ];

  beforeEach(async () => {
    const readingsSpy = jasmine.createSpyObj('ReadingsService', ['getAllReadingsBySubscriberId']);

    await TestBed.configureTestingModule({
      imports: [DetailsForSubscriberComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ReadingsService, useValue: readingsSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsForSubscriberComponent);
    component = fixture.componentInstance;
    readingsService = TestBed.inject(ReadingsService) as jasmine.SpyObj<ReadingsService>;

    component.subscriber = mockSubscriber;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch readings for the subscriber on initialization', () => {
      readingsService.getAllReadingsBySubscriberId.and.returnValue(of(mockReadings));

      component.ngOnInit();

      expect(readingsService.getAllReadingsBySubscriberId).toHaveBeenCalledWith(mockSubscriber.id);
      expect(component.subscriberReadings).toEqual(mockReadings);
      expect(component.searchingForReadings).toBeFalse();
    });

    it('should handle errors when fetching readings', () => {
      const error = new Error('Failed to fetch readings');
      readingsService.getAllReadingsBySubscriberId.and.returnValue(throwError(() => error));
      spyOn(console, 'error'); // Mock console.error

      component.ngOnInit();

      expect(readingsService.getAllReadingsBySubscriberId).toHaveBeenCalledWith(mockSubscriber.id);
      expect(component.subscriberReadings).toEqual([]);
      expect(component.searchingForReadings).toBeFalse();
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('getReadingsForSubscriber', () => {
    it('should fetch readings and update subscriberReadings', () => {
      readingsService.getAllReadingsBySubscriberId.and.returnValue(of(mockReadings));

      component.getReadingsForSubscriber();

      expect(component.subscriberReadings).toEqual(mockReadings);
      expect(component.searchingForReadings).toBeFalse();
    });

    it('should set searchingForReadings to true during the fetch process', () => {
      readingsService.getAllReadingsBySubscriberId.and.returnValue(of(mockReadings));

      component.getReadingsForSubscriber();

      expect(component.searchingForReadings).toBeFalse(); // False after fetching
    });

    it('should handle errors when fetching readings', () => {
      const error = new Error('Failed to fetch readings');
      readingsService.getAllReadingsBySubscriberId.and.returnValue(throwError(() => error));
      spyOn(console, 'error'); // Mock console.error

      component.getReadingsForSubscriber();

      expect(component.subscriberReadings).toEqual([]);
      expect(component.searchingForReadings).toBeFalse();
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
