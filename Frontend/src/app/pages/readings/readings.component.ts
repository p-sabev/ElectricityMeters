import { Component } from '@angular/core';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { ErrorService } from '../../core/services/error.service';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReadingsService } from './readings.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePipe, LowerCasePipe, NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TableModule } from 'primeng/table';
import { Reading } from '../../core/models/readings.model';
import { AddReadingForSubscriberComponent } from './add-reading-for-subscriber/add-reading-for-subscriber.component';
import { TwoAfterDotPipe } from '../../shared/pipes/two-after-dot/two-after-dot.pipe';
import { ReceiptComponent } from './receipt/receipt.component';
import { PrintReceiptComponent } from './print-receipt/print-receipt.component';
import { PageHeadingComponent } from '../../core/ui/page-heading/page-heading.component';
import { RoleAccessDirective } from '../../shared/directives/role-access/role-access.directive';
import { PaginatorModule } from 'primeng/paginator';
import { PendingPaymentsComponent } from './pending-payments/pending-payments.component';
import { TooltipModule } from 'primeng/tooltip';
import { DisplayTwoThreePhaseReadingComponent } from './display-two-three-phase-reading/display-two-three-phase-reading.component';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-readings',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    DatePipe,
    FaIconComponent,
    NgIf,
    SharedModule,
    TableModule,
    TranslateModule,
    AddReadingForSubscriberComponent,
    TwoAfterDotPipe,
    ReceiptComponent,
    PrintReceiptComponent,
    PageHeadingComponent,
    RoleAccessDirective,
    LowerCasePipe,
    NgForOf,
    PaginatorModule,
    PendingPaymentsComponent,
    TooltipModule,
    DisplayTwoThreePhaseReadingComponent,
  ],
  templateUrl: './readings.component.html',
  styleUrl: './readings.component.scss',
})
export class ReadingsComponent {
  constructor(
    private readingsService: ReadingsService,
    private errorService: ErrorService,
    private confirmService: ConfirmationService,
    private translate: TranslateService,
    private notifications: NotificationsEmitterService,
    private tableHelper: TableHelperService
  ) {}

  readingsList: Reading[] = [];

  sortField = 'id';
  sortOrder = -1;
  page = 0;
  totalRecords = 0;
  lastUsedSettings: any = null;
  searchSubscriberName: string = '';

  readingForEdit: Reading | null = null;
  readingToPrintReceipt!: Reading | null;

  firstInit: boolean = true;
  noRecords: boolean = false;
  noResults: boolean = false;

  showPendingPaymentsReport: boolean = false;

  fetchReadingsList(settings: any = this.lastUsedSettings) {
    this.lastUsedSettings = settings;
    const body = {
      paging: this.tableHelper.getPagingSettings(settings),
      sorting: this.tableHelper.getSortingSettings(settings),
      name: this.searchSubscriberName,
    };
    this.readingsService
      .searchReadings(body)
      .pipe(
        tap((resp) => {
          this.readingsList = resp?.data || [];
          this.totalRecords = resp?.totalRecords || 0;
          ({ noRecords: this.noRecords, noResults: this.noResults } = this.tableHelper.isNoResultsOrNoRecords(
            this.firstInit,
            this.totalRecords
          ));
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.firstInit = false;
        })
      )
      .subscribe();
  }

  openReadingForEdit(reading: Reading) {
    this.readingForEdit = reading;
  }

  askToDeleteReading(reading: Reading) {
    const message = 'AreYouSureToDeleteThisReading';
    const header = 'AreYouSure';
    this.translate.get([message, header]).subscribe((data) => {
      this.confirmService.confirm({
        message: `${data[message]}?`,
        icon: 'fa fa-question-circle-o',
        header: data[header],
        accept: () => {
          this.deleteReading(reading);
        },
      });
    });
  }

  deleteReading(reading: Reading) {
    this.readingsService
      .deleteReading(reading.id)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyDeletedReading');
          this.fetchReadingsList();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
