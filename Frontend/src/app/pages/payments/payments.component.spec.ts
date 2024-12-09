import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsComponent } from './payments.component';
import { PaymentsService } from './payments.service';
import { ErrorService } from '../../core/services/error.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Payment } from '../../core/models/payment.model';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;
  let paymentsService: PaymentsService;
  let errorService: ErrorService;
  let confirmService: ConfirmationService;
  let translate: TranslateService;
  let notifications: NotificationsEmitterService;
  let tableHelper: TableHelperService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsComponent, HttpClientTestingModule],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            searchPayments: jasmine.createSpy('searchPayments').and.returnValue(of({ data: [], totalRecords: 0 })),
            deletePayment: jasmine.createSpy('deletePayment').and.returnValue(of({})),
          },
        },
        { provide: ErrorService, useValue: { processError: jasmine.createSpy('processError') } },
        { provide: ConfirmationService, useValue: { confirm: jasmine.createSpy('confirm') } },
        { provide: TranslateService, useValue: { get: jasmine.createSpy('get').and.returnValue(of({})) } },
        { provide: NotificationsEmitterService, useValue: { Success: { emit: jasmine.createSpy('emit') } } },
        {
          provide: TableHelperService,
          useValue: {
            isNoResultsOrNoRecords: jasmine
              .createSpy('isNoResultsOrNoRecords')
              .and.returnValue({ noRecords: false, noResults: false }),
            getPagingSettings: jasmine.createSpy('getPagingSettings').and.returnValue({}),
            getSortingSettings: jasmine.createSpy('getSortingSettings').and.returnValue({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    paymentsService = TestBed.inject(PaymentsService);
    errorService = TestBed.inject(ErrorService);
    confirmService = TestBed.inject(ConfirmationService);
    translate = TestBed.inject(TranslateService);
    notifications = TestBed.inject(NotificationsEmitterService);
    tableHelper = TestBed.inject(TableHelperService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch payments list with correct settings', () => {
    const settings = { first: 0, rows: 10, sortField: 'id', sortOrder: 1 };
    component.fetchPaymentsList(settings);
    expect(paymentsService.searchPayments).toHaveBeenCalledWith(component.getFetchPaymentsBody(settings));
  });

  it('should handle error when fetching payments list fails', () => {
    (paymentsService.searchPayments as jasmine.Spy).and.returnValue(throwError(() => new Error('Error')));
    component.fetchPaymentsList();
    expect(errorService.processError).toHaveBeenCalled();
  });

  it('should set noRecords and noResults correctly', () => {
    component.fetchPaymentsList();
    expect(component.noRecords).toBeFalse();
    expect(component.noResults).toBeFalse();
  });

  it('should reset firstInit to false after fetching payments list', () => {
    component.fetchPaymentsList();
    expect(component.firstInit).toBeFalse();
  });

  it('should ask to delete payment and call confirm service', () => {
    const payment = { id: 1 } as Payment;
    component.askToDeletePayment(payment);
    expect(confirmService.confirm).toHaveBeenCalled();
  });

  it('should delete payment and fetch payments list', () => {
    const payment = { id: 1 } as Payment;
    component.deletePayment(payment);
    expect(paymentsService.deletePayment).toHaveBeenCalledWith(1);
    expect(notifications.Success.emit).toHaveBeenCalledWith('SuccessfullyDeletedPayment');
    expect(paymentsService.searchPayments).toHaveBeenCalled();
  });

  it('should handle error when deleting payment fails', () => {
    (paymentsService.deletePayment as jasmine.Spy).and.returnValue(throwError(() => new Error('Error')));
    component.deletePayment({ id: 1 } as Payment);
    expect(errorService.processError).toHaveBeenCalled();
  });

  it('should sum fees correctly', () => {
    const fees = [
      { value: 10, description: '' },
      { value: 20, description: '' },
    ];
    expect(component.sumFees(fees)).toBe(30);
  });

  it('should sum 0.1 + 0.2 correctly', () => {
    const fees = [
      { value: 0.1, description: '' },
      { value: 0.2, description: '' },
    ];
    expect(component.sumFees(fees)).toBe(0.3);
  });

  it('should return 0 if fees are empty', () => {
    expect(component.sumFees([])).toBe(0);
  });
});
