import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscriber} from "../../../core/models/subscribers.model";
import {InsertMultipleReadings, Reading} from "../../../core/models/readings.model";
import {ReadingsService} from "../readings.service";
import {NotificationsEmitterService} from "../../../core/services/notifications.service";
import {ErrorService} from "../../../core/services/error.service";
import * as moment from "moment/moment";
import {CalendarModule} from "primeng/calendar";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-add-reading-for-switchboard',
  standalone: true,
  imports: [
    CalendarModule,
    FaIconComponent,
    FormErrorsComponent,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-reading-for-switchboard.component.html',
  styleUrl: './add-reading-for-switchboard.component.scss'
})
export class AddReadingForSwitchboardComponent implements OnInit {
  @Input() subscribers!: Subscriber[] | null | undefined;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readingsService: ReadingsService,
              private notifications: NotificationsEmitterService,
              private errorService: ErrorService) {
  }

  readingsDate: Date | string = moment(new Date()).toDate();
  readingsValues: number[] = new Array(this.subscribers?.length).fill(0);

  ngOnInit() {
  }

  addReadings() {
    const body: InsertMultipleReadings = {
      subscribersReading: []
    };
    this.subscribers?.forEach((subscriber: Subscriber, index: number) => {
      body.subscribersReading.push({
        subscriberId: subscriber.id,
        date: moment(this.readingsDate).format('YYYY-MM-DD') + 'T00:00:00.000Z',
        value: this.readingsValues[index] || 0
      });
    });
    this.readingsService.insertReadingsForSubscribers(body).subscribe(() => {
      this.notifications.Success.emit('SuccessfullyAddedReadings');
      this.close.emit();
    }, error => {
      this.errorService.processError(error);
    });
  }

}
