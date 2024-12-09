import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintReceiptComponent } from './print-receipt.component';
import { PaymentsService } from '../../payments/payments.service';
import { SettingsService } from '../../settings/settings.service';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { PaymentFee, Reading } from '../../../core/models/readings.model';
import { EventEmitter } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faMoneyBill, faPlus, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PrintReceiptComponent', () => {
  let component: PrintReceiptComponent;
  let fixture: ComponentFixture<PrintReceiptComponent>;
  let paymentsService: jasmine.SpyObj<PaymentsService>;
  let settingsService: jasmine.SpyObj<SettingsService>;
  let notifications: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let translate: jasmine.SpyObj<TranslateService>;

  const mockFeeList: PaymentFee[] = [
    { id: 1, description: 'Fee 1', value: 50, paymentId: 1, dataGroup: 1 },
    { id: 2, description: 'Fee 2', value: 100, paymentId: 1, dataGroup: 1 },
  ];

  const mockReading: Reading = {
    id: 1,
    dateFrom: new Date('2023-01-01'),
    dateTo: new Date('2023-01-31'),
    feeList: [],
    isPaid: false,
    value: 100,
    firstPhaseValue: 0,
    secondPhaseValue: 0,
    thirdPhaseValue: 0,
    amountDue: 100,
    difference: 0,
    currentPrice: 0,
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
  };

  beforeEach(() => {
    const paymentsServiceMock = jasmine.createSpyObj('PaymentsService', ['insertPayment']);
    const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['getDefaultFees']);
    const notificationsMock = jasmine.createSpyObj('NotificationsEmitterService', ['Success', 'Error']);
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);
    const translateMock = jasmine.createSpyObj('TranslateService', [], {
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
      get: jasmine.createSpy('get').and.returnValue(of({})),
      instant: jasmine.createSpy('instant').and.callFake((key: string) => key),
    });

    TestBed.configureTestingModule({
      imports: [PrintReceiptComponent, HttpClientTestingModule],
      providers: [
        { provide: PaymentsService, useValue: paymentsServiceMock },
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    }).compileComponents();

    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faPrint, faPlus, faTrash, faMoneyBill);

    fixture = TestBed.createComponent(PrintReceiptComponent);
    component = fixture.componentInstance;

    paymentsService = TestBed.inject(PaymentsService) as jasmine.SpyObj<PaymentsService>;
    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
    notifications = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    component.reading = mockReading; // Set the reading with feeList null
    settingsService.getDefaultFees.and.returnValue(of(mockFeeList)); // Mock the default fees service
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default fees if reading does not have fees', () => {
    component.ngOnInit();
    expect(settingsService.getDefaultFees).toHaveBeenCalled();
    expect(component.feeList).toEqual(mockFeeList);
  });

  it('should handle error during fetchAllDefaultFees', () => {
    settingsService.getDefaultFees.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    expect(settingsService.getDefaultFees).toHaveBeenCalled();
    expect(errorService.processError).toHaveBeenCalled();
  });
});
