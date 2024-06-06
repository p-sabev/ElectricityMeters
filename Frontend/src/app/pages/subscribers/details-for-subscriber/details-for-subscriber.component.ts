import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscriber} from "../../../core/models/subscribers.model";
import {ErrorService} from "../../../core/services/error.service";
import {Reading} from "../../../core/models/readings.model";
import {ReadingsService} from "../../readings/readings.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TwoAfterDotPipe} from "../../../shared/pipes/twoAfterDot.pipe";

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
    TwoAfterDotPipe
  ],
  templateUrl: './details-for-subscriber.component.html',
  styleUrl: './details-for-subscriber.component.scss'
})
export class DetailsForSubscriberComponent implements OnInit {
  @Input() subscriber!: Subscriber;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readingsService: ReadingsService,
              private errorService: ErrorService) {
  }

  subscriberReadings: Reading[] = [];

  readingToPrintReceipt: Reading | null = null;
  searchingForReadings = false;

  ngOnInit() {
    this.getReadingsForSubscriber();
  }

  getReadingsForSubscriber() {
    this.searchingForReadings = true;
    this.readingsService.getAllReadingsBySubscriberId(this.subscriber.id).subscribe(resp => {
      this.subscriberReadings = resp;
      this.searchingForReadings = false;
    }, error => {
      this.errorService.processError(error);
      this.searchingForReadings = false;
    });
  }
}
