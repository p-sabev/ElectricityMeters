import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingPaymentsComponent } from './pending-payments.component';
import { ReadingsService } from '../readings.service';
import { ErrorService } from '../../../core/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PendingPaymentsReportResponse } from '../../../core/models/readings.model';
import { EventEmitter } from '@angular/core';

describe('PendingPaymentsComponent', () => {
  let component: PendingPaymentsComponent;
  let fixture: ComponentFixture<PendingPaymentsComponent>;
  let readingsService: jasmine.SpyObj<ReadingsService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let translate: jasmine.SpyObj<TranslateService>;

  const mockPendingPaymentsResponse: PendingPaymentsReportResponse = {
    pendingTotalElectricity: 500,
    pendingTotalFees: 500,
    standardFeesSum: 250,
    subscribersPendindPayments: [
      {
        subscriber: {
          id: 1,
          name: 'Subscriber 1',
          phaseCount: 1,
          lastRecordDate: new Date('2023-01-01T00:00:00.000Z'),
          lastReading: 100,
          defaultReading: 50,
          numberPage: 0,
          switchboard: { id: 1, name: '1' },
        },
        paymentsCount: 2,
        totalAmountDue: 200,
      },
    ],
  };

  beforeEach(() => {
    const readingsServiceMock = jasmine.createSpyObj('ReadingsService', ['fetchAllPendingPayments']);
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);
    const translateMock = jasmine.createSpyObj('TranslateService', [], {
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
      get: jasmine.createSpy('get').and.returnValue(of({})),
      instant: jasmine.createSpy('instant').and.callFake((key: string) => key),
    });

    TestBed.configureTestingModule({
      imports: [PendingPaymentsComponent, HttpClientTestingModule],
      providers: [
        { provide: ReadingsService, useValue: readingsServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingPaymentsComponent);
    component = fixture.componentInstance;

    readingsService = TestBed.inject(ReadingsService) as jasmine.SpyObj<ReadingsService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all pending payments report on initialization', () => {
    readingsService.fetchAllPendingPayments.and.returnValue(of(mockPendingPaymentsResponse));

    component.ngOnInit();

    expect(readingsService.fetchAllPendingPayments).toHaveBeenCalled();
    expect(component.pendingPaymentsReportData).toEqual(mockPendingPaymentsResponse);
    expect(component.hasSomeWithMoreThanOnePayment).toBeTrue();
  });

  it('should handle errors when fetching pending payments report fails', () => {
    readingsService.fetchAllPendingPayments.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(readingsService.fetchAllPendingPayments).toHaveBeenCalled();
    expect(errorService.processError).toHaveBeenCalled();
    expect(component.pendingPaymentsReportData).toBeNull();
    expect(component.hasSomeWithMoreThanOnePayment).toBeFalse();
  });

  it('should process the close event when triggered', () => {
    spyOn(component.close, 'emit');

    component.close.emit();

    expect(component.close.emit).toHaveBeenCalled();
  });
});
