import { Component } from '@angular/core';
import {PageHeadingComponent} from "../../core/ui/page-heading/page-heading.component";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {Fee, Payment} from "../../core/models/payment.model";
import {PaymentsService} from "./payments.service";
import {DatePipe, LowerCasePipe, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RoleAccessDirective} from "../../shared/directives/role-access.directive";
import {TableModule} from "primeng/table";
import {TwoAfterDotPipe} from "../../shared/pipes/twoAfterDot.pipe";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {PaymentFee, Reading} from "../../core/models/readings.model";
import {PrintReceiptComponent} from "../readings/print-receipt/print-receipt.component";
import {PaginatorModule} from "primeng/paginator";
import {PaymentReportComponent} from "./payment-report/payment-report.component";

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
    PaymentReportComponent
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

  constructor(private paymentsService: PaymentsService,
              private errorService: ErrorService,
              private confirmService: ConfirmationService,
              private translate: TranslateService,
              private notifications: NotificationsEmitterService) {}

  paymentsList: Payment[] = [];

  page = 0;
  sortField = 'id';
  sortOrder = -1;
  totalRecords = 0;
  lastUsedSettings: any = null;
  searchSubscriberName: string = '';

  readingToPrintReceipt!: Reading | null;

  firstInit: boolean = true;
  noRecords: boolean = false;
  noResults: boolean = false;

  showPaymentReport: boolean = false;

  fetchPaymentsList(settings: any = this.lastUsedSettings) {
    this.lastUsedSettings = settings;
    const body = {
      paging: {
        page: settings.first / settings.rows,
        pageSize: settings.rows
      },
      sorting: {
        sortProp: settings.sortField,
        sortDirection: settings.sortOrder
      },
      name: this.searchSubscriberName
    }
    this.paymentsService.searchPayments(body).subscribe(resp => {
      this.paymentsList = resp?.data || [];
      this.totalRecords = resp?.totalRecords || 0;

      if (this.firstInit && this.totalRecords === 0) {
        this.noRecords = true;
      } else if (!this.firstInit && this.totalRecords === 0) {
        this.noResults = true;
      } else {
        this.noRecords = false;
        this.noResults = false;
      }
    }, error => {
      this.errorService.processError(error);
    }, () => {
      this.firstInit = false;
    });
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
    this.paymentsService.deletePayment(payment.id).subscribe(() => {
      this.notifications.Success.emit("SuccessfullyDeletedPayment");
      this.fetchPaymentsList();
    }, error => {
      this.errorService.processError(error);
    });
  }

  sumFees(fees: Fee[]): number {
    let feesSum = 0;
    fees?.forEach((fee: Fee) => {
      if (fee.value && fee.value > 0) {
        feesSum += fee.value;
      }
    });
    return feesSum;
  }
}
