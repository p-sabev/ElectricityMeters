import {Component} from '@angular/core';
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ReadingsService} from "./readings.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DatePipe, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TableModule} from "primeng/table";
import {Reading} from "../../core/models/readings.model";
import {AddReadingForSubscriberComponent} from "./add-reading-for-subscriber/add-reading-for-subscriber.component";
import {TwoAfterDotPipe} from "../../shared/pipes/twoAfterDot.pipe";
import {ReceiptComponent} from "./receipt/receipt.component";

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
    ReceiptComponent
  ],
  templateUrl: './readings.component.html',
  styleUrl: './readings.component.scss'
})
export class ReadingsComponent {

  constructor(private readingsService: ReadingsService,
              private errorService: ErrorService,
              private confirmService: ConfirmationService,
              private translate: TranslateService,
              private notifications: NotificationsEmitterService) {}

  readingsList: Reading[] = [];

  sortField = 'id';
  sortOrder = -1;
  totalRecords = 0;
  lastUsedSettings: any = null;

  readingForEdit: Reading | null = null;

  fetchReadingsList(settings: any = this.lastUsedSettings) {
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
      name: ''
    }
    console.log(body);
    this.readingsService.searchReadings(body).subscribe(resp => {
      this.readingsList = resp?.data || [];
      this.totalRecords = resp?.totalRecords || 0;
    }, error => {
      this.errorService.processError(error);
    });
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
    this.readingsService.deleteReading(reading.id).subscribe(() => {
      this.notifications.Success.emit("SuccessfullyDeletedReading");
      this.fetchReadingsList();
    }, error => {
      this.errorService.processError(error);
    });
  }

}
