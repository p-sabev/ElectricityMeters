import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {Subscriber} from "../../../core/models/subscribers.model";
import {SubscribersService} from "../../subscribers/subscribers.service";
import {SwitchboardsService} from "../../switchboards/switchboards.service";
import {NotificationsEmitterService} from "../../../core/services/notifications.service";
import {ErrorService} from "../../../core/services/error.service";
import {Switchboard} from "../../../core/models/switchboards.model";
import * as moment from 'moment';
import {ReadingsService} from "../readings.service";
import {EditReading, Reading} from "../../../core/models/readings.model";
import {CalendarModule} from "primeng/calendar";

@Component({
  selector: 'app-add-reading-for-subscriber',
  standalone: true,
  imports: [
    FaIconComponent,
    FormErrorsComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule
  ],
  templateUrl: './add-reading-for-subscriber.component.html',
  styleUrl: './add-reading-for-subscriber.component.scss'
})
export class AddReadingForSubscriberComponent implements OnInit {
  @Input() subscriber!: Subscriber;
  @Input() readingToEdit: Reading | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readingsService: ReadingsService,
              private notifications: NotificationsEmitterService,
              private errorService: ErrorService) {
  }

  addEditReadingForm!: FormGroup;
  lastReadingDate: Date | null = null;
  minReadingValue: number = 0;

  ngOnInit() {
    if (this.readingToEdit) {
      this.subscriber = this.readingToEdit.subscriber;
    }
    this.initAddReadingForm();
  }

  initAddReadingForm() {
    this.lastReadingDate = (this.subscriber?.lastRecordDate ? moment(this.subscriber?.lastRecordDate).toDate() : null);
    this.minReadingValue = (this.subscriber.lastReading || this.subscriber.defaultReading || 0);
    this.addEditReadingForm = new FormGroup({
      id: new FormControl<number | null>(this.readingToEdit?.id || null, this.readingToEdit ? [Validators.required] : []),
      subscriberId: new FormControl<number>(this.subscriber.id, [Validators.required]),
      value: new FormControl<number | null>(this.readingToEdit ? this.readingToEdit.value : null,
        [Validators.required, Validators.min(this.minReadingValue), Validators.max(2147483647)]),
      dateFrom: new FormControl<Date | null>(this.readingToEdit ? moment(this.readingToEdit.dateFrom).toDate() : this.lastReadingDate, [Validators.required]),
      dateTo: new FormControl<Date>(this.readingToEdit ? moment(this.readingToEdit.dateTo).toDate() : moment(new Date()).toDate(), [Validators.required]),
    });
  }

  addReading() {
    const body = this.addEditReadingForm?.getRawValue() || {};
    body.dateFrom = moment(body.dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    body.dateTo = moment(body.dateTo).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    delete body.id;
    this.readingsService.insertReading(body).subscribe(() => {
      this.notifications.Success.emit('SuccessfullyAddedReading');
      this.close.emit();
    }, error => {
      this.errorService.processError(error);
    });
  }

  editReading() {
    const body: EditReading = this.addEditReadingForm?.getRawValue() || {};
    body.dateFrom = moment(body.dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    body.dateTo = moment(body.dateTo).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    this.readingsService.editReading(body).subscribe(() => {
      this.notifications.Success.emit('SuccessfullyEditedReading');
      this.close.emit();
    }, error => {
      this.errorService.processError(error);
    });
  }

}
