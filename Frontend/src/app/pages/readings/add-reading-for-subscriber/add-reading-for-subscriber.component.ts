import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorsComponent } from '../../../shared/features/form-errors/form-errors.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subscriber } from '../../../core/models/subscribers.model';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import * as moment from 'moment';
import { ReadingsService } from '../readings.service';
import { EditReading, InsertReading, Reading } from '../../../core/models/readings.model';
import { CalendarModule } from 'primeng/calendar';
import { catchError, EMPTY, tap } from 'rxjs';

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
    CalendarModule,
    NgClass,
  ],
  templateUrl: './add-reading-for-subscriber.component.html',
  styleUrl: './add-reading-for-subscriber.component.scss',
})
export class AddReadingForSubscriberComponent implements OnInit {
  @Input() subscriber!: Subscriber;
  @Input() readingToEdit: Reading | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readingsService: ReadingsService,
    private notifications: NotificationsEmitterService,
    private errorService: ErrorService
  ) {}

  MAX_INT = 2147483647;

  addEditReadingForm!: FormGroup;
  lastReadingDate: Date | null = null;
  minReadingValue: number = 0;

  theReadingIsSuspiciouslyBig: boolean = false;

  ngOnInit() {
    if (this.readingToEdit) {
      this.subscriber = this.readingToEdit.subscriber;
    }
    this.initAddReadingForm();
  }

  initAddReadingForm() {
    this.lastReadingDate = this.subscriber?.lastRecordDate ? moment(this.subscriber?.lastRecordDate).toDate() : null;
    this.minReadingValue = this.subscriber.lastReading || this.subscriber.defaultReading || 0;
    this.addEditReadingForm = new FormGroup({
      id: new FormControl<number | null>(
        this.readingToEdit?.id || null,
        this.readingToEdit ? [Validators.required] : []
      ),
      subscriberId: new FormControl<number>(this.subscriber.id, [Validators.required]),
      value: new FormControl<number | null>(
        this.readingToEdit ? this.readingToEdit.value : null,
        this.subscriber.phaseCount === 1
          ? [Validators.required, Validators.min(this.minReadingValue), Validators.max(this.MAX_INT)]
          : []
      ),
      firstPhaseValue: new FormControl<number | null>(
        this.readingToEdit ? this.readingToEdit.value : null,
        this.subscriber.phaseCount > 1 ? [Validators.required, Validators.max(this.MAX_INT)] : []
      ),
      secondPhaseValue: new FormControl<number | null>(
        this.readingToEdit ? this.readingToEdit.value : null,
        this.subscriber.phaseCount > 1 ? [Validators.required, Validators.max(this.MAX_INT)] : []
      ),
      thirdPhaseValue: new FormControl<number | null>(
        this.readingToEdit ? this.readingToEdit.value : null,
        this.subscriber.phaseCount > 2 ? [Validators.required, Validators.max(this.MAX_INT)] : []
      ),
      dateFrom: new FormControl<Date | null>(
        this.readingToEdit ? moment(this.readingToEdit.dateFrom).toDate() : this.lastReadingDate,
        [Validators.required]
      ),
      dateTo: new FormControl<Date>(
        this.readingToEdit ? moment(this.readingToEdit.dateTo).toDate() : moment(new Date()).toDate(),
        [Validators.required]
      ),
    });
  }

  addReading() {
    const body: InsertReading = this.getBodyToAddReading();
    this.readingsService
      .insertReading(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyAddedReading');
          this.close.emit();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  getBodyToAddReading(): InsertReading {
    const body = this.addEditReadingForm?.getRawValue() || {};

    body.firstPhaseValue = body.firstPhaseValue || 0;
    body.secondPhaseValue = body.secondPhaseValue || 0;
    body.thirdPhaseValue = body.thirdPhaseValue || 0;

    if (this.subscriber.phaseCount === 2) {
      body.value = body.firstPhaseValue + body.secondPhaseValue;
    } else if (this.subscriber.phaseCount === 3) {
      body.value = body.firstPhaseValue + body.secondPhaseValue + body.thirdPhaseValue;
    }
    body.dateFrom = moment(body.dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    body.dateTo = moment(body.dateTo).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    delete body.id;

    return body;
  }

  editReading() {
    const body: EditReading = this.getBodyForEditReading();
    this.readingsService
      .editReading(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyEditedReading');
          this.close.emit();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  getBodyForEditReading(): EditReading {
    const body: EditReading = this.addEditReadingForm?.getRawValue() || {};
    body.dateFrom = moment(body.dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    body.dateTo = moment(body.dateTo).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    return body;
  }

  checkIfSingleReadingIsTooBig() {
    this.theReadingIsSuspiciouslyBig = (this.addEditReadingForm.get('value')?.value || 0) > this.minReadingValue + 2000;
  }

  checkIfMultiPhaseReadingIsTooBig() {
    const enteredSum =
      (this.addEditReadingForm.get('firstPhaseValue')?.value || 0) +
      (this.addEditReadingForm.get('secondPhaseValue')?.value || 0) +
      (this.addEditReadingForm.get('thirdPhaseValue')?.value || 0);
    console.log('enteredSum', enteredSum);
    console.log('minReadingValue + 2000', this.minReadingValue + 2000);
    this.theReadingIsSuspiciouslyBig = enteredSum > this.minReadingValue + 2000;
  }
}
