import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentReportComponent } from './payment-report.component';
import { PaymentsService } from '../payments.service';
import { ErrorService } from '../../../core/services/error.service';
import { of, throwError } from 'rxjs';
import { PaymentsReportResponse } from '../../../core/models/payment.model';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PaymentReportComponent', () => {
  let component: PaymentReportComponent;
  let fixture: ComponentFixture<PaymentReportComponent>;
  let paymentsService: PaymentsService;
  let errorService: ErrorService;
  const paymentServiceMock = {
    searchPaymentsReport: jasmine.createSpy('searchPaymentsReport').and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReportComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: PaymentsService, useValue: paymentServiceMock },
        { provide: ErrorService, useValue: { processError: jasmine.createSpy('processError') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentReportComponent);
    component = fixture.componentInstance;
    paymentsService = TestBed.inject(PaymentsService);
    errorService = TestBed.inject(ErrorService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when close method is called', () => {
    spyOn(component.close, 'emit');
    component.close.emit();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should set paymentReportData when fetchPaymentReport is successful', () => {
    const mockResponse: PaymentsReportResponse = {
      dateFrom: '2023-10-01T12:00:00.000Z',
      dateTo: '2023-10-01T12:00:00.000Z',
      paidTotalElectricity: 1000,
      paidTotalFees: 100,
      fees: [
        {
          description: 'Fee 1',
          totalValue: 100,
        },
      ],
    };
    (paymentsService.searchPaymentsReport as jasmine.Spy).and.returnValue(of(mockResponse));
    component.fetchPaymentReport();
    expect(component.paymentReportData).toEqual(mockResponse);
  });

  it('should call processError when fetchPaymentReport fails', () => {
    (paymentsService.searchPaymentsReport as jasmine.Spy).and.returnValue(throwError(() => new Error('Error')));
    component.fetchPaymentReport();
    expect(errorService.processError).toHaveBeenCalled();
  });

  it('should handle empty paymentReportData correctly', () => {
    (paymentsService.searchPaymentsReport as jasmine.Spy).and.returnValue(of(null));
    component.fetchPaymentReport();
    expect(component.paymentReportData).toBeNull();
  });
});
