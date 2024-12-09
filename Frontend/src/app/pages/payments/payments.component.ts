import {Component} from '@angular/core';
import {PageHeadingComponent} from "../../core/ui/page-heading/page-heading.component";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {Fee, Payment, SearchPaymentsListRequest} from "../../core/models/payment.model";
import {PaymentsService} from "./payments.service";
import {DatePipe, LowerCasePipe, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RoleAccessDirective} from "../../shared/directives/role-access/role-access.directive";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {TwoAfterDotPipe} from "../../shared/pipes/two-after-dot/two-after-dot.pipe";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {PaymentFee, Reading} from "../../core/models/readings.model";
import {PrintReceiptComponent} from "../readings/print-receipt/print-receipt.component";
import {PaginatorModule} from "primeng/paginator";
import {PaymentReportComponent} from "./payment-report/payment-report.component";
import {TooltipModule} from "primeng/tooltip";
import {
  DisplayTwoThreePhaseReadingComponent
} from "../readings/display-two-three-phase-reading/display-two-three-phase-reading.component";
import {TableHelperService} from "../../core/helpers/table-helper.service";
import {catchError, EMPTY, tap} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    PageHeadingComponent,
    DatePipe,
    FaIconComponent,
    NgIf,
    RoleAccessDirective,
    SharedModule,
    TableModule,
    TranslateModule,
    TwoAfterDotPipe,
    ConfirmDialogModule,
    PrintReceiptComponent,
    LowerCasePipe,
    PaginatorModule,
    PaymentReportComponent,
    TooltipModule,
    DisplayTwoThreePhaseReadingComponent
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

  constructor(private paymentsService: PaymentsService,
              private errorService: ErrorService,
              private confirmService: ConfirmationService,
              private translate: TranslateService,
              private notifications: NotificationsEmitterService,
              private tableHelper: TableHelperService) {
  }

  paymentsList: Payment[] = [];

  page = 0;
  sortField = 'id';
  sortOrder = -1;
  totalRecords = 0;
  firstInit: boolean = true;
  noRecords: boolean = false;
  noResults: boolean = false;
  lastUsedSettings: any = null;
  searchSubscriberName: string = '';

  readingToPrintReceipt!: Reading | null;
  showPaymentReport: boolean = false;

  fetchPaymentsList(settings: TableLazyLoadEvent = this.lastUsedSettings) {
    this.lastUsedSettings = settings;
    const body = this.getFetchPaymentsBody(settings);

    this.paymentsService.searchPayments(body).pipe(
      tap(resp => {
        this.paymentsList = resp?.data || [];
        this.totalRecords = resp?.totalRecords || 0;
        ({
          noRecords: this.noRecords,
          noResults: this.noResults
        } = this.tableHelper.isNoResultsOrNoRecords(this.firstInit, this.totalRecords));
      }),
      catchError(error => {
        this.errorService.processError(error);
        return EMPTY;
      }),
      finalize(() => {
        this.firstInit = false;
      })
    ).subscribe();
  }

  getFetchPaymentsBody(settings: TableLazyLoadEvent): SearchPaymentsListRequest {
    return {
      paging: this.tableHelper.getPagingSettings(settings),
      sorting: this.tableHelper.getSortingSettings(settings),
      name: this.searchSubscriberName
    };
  }

  openReadingToPrint(reading: Reading, feeList: PaymentFee[]) {
    reading.isPaid = true;
    reading.feeList = feeList;
    this.readingToPrintReceipt = reading;
  }

  askToDeletePayment(payment: Payment) {
    const message = 'AreYouSureToDeleteThisPayment';
    const header = 'AreYouSure';
    this.translate.get([message, header]).subscribe((data) => {
      this.confirmService.confirm({
        message: `${data[message]}?`,
        icon: 'fa fa-question-circle-o',
        header: data[header],
        accept: () => {
          this.deletePayment(payment);
        },
      });
    });
  }

  deletePayment(payment: Payment) {
    this.paymentsService.deletePayment(payment.id).pipe(
      tap(() => {
        this.notifications.Success.emit("SuccessfullyDeletedPayment");
        this.fetchPaymentsList();
      }),
      catchError(error => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

  sumFees(fees: Fee[]): number {
    let feesSum = 0;
    fees?.forEach((fee: Fee) => {
      if (fee.value && fee.value > 0) {
        feesSum = (((feesSum * 100) + (fee.value * 100)) / 100);
      }
    });
    return feesSum;
  }
}
