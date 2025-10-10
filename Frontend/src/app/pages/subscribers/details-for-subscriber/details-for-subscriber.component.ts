import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscriber } from '../../../core/models/subscribers.model';
import { Reading } from '../../../core/models/readings.model';
import { ReadingsService } from '../../readings/readings.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TwoAfterDotPipe } from '../../../shared/pipes/two-after-dot/two-after-dot.pipe';
import { PrintReceiptComponent } from '../../readings/print-receipt/print-receipt.component';
import { catchError, EMPTY, tap } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-details-for-subscriber',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgIf,
    TranslateModule,
    DatePipe,
    SharedModule,
    TableModule,
    TwoAfterDotPipe,
    PrintReceiptComponent,
    TooltipModule,
  ],
  templateUrl: './details-for-subscriber.component.html',
  styleUrl: './details-for-subscriber.component.scss',
})
export class DetailsForSubscriberComponent implements OnInit {
  @Input() subscriber!: Subscriber;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readingsService: ReadingsService) {}

  subscriberReadings: Reading[] = [];

  readingToPrintReceipt: Reading | null = null;
  searchingForReadings = false;

  ngOnInit() {
    this.getReadingsForSubscriber();
  }

  getReadingsForSubscriber() {
    this.searchingForReadings = true;
    this.readingsService
      .getAllReadingsBySubscriberId(this.subscriber.id)
      .pipe(
        tap((resp) => {
          this.subscriberReadings = resp;
          this.searchingForReadings = false;
        }),
        catchError((error) => {
          console.error(error);
          // this.errorService.processError(error);
          this.searchingForReadings = false;
          return EMPTY;
        })
      )
      .subscribe();
  }

  // openPrintReading(reading: Reading) {
  //   let readingAndSubscriber = reading;
  //   readingAndSubscriber.subscriber = this.subscriber;
  //   this.readingToPrintReceipt = readingAndSubscriber;
  // }
}
