import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscriber } from '../../../core/models/subscribers.model';
import { InsertMultipleReadings } from '../../../core/models/readings.model';
import { ReadingsService } from '../readings.service';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import * as moment from 'moment/moment';
import { CalendarModule } from 'primeng/calendar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorsComponent } from '../../../shared/features/form-errors/form-errors.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, EMPTY, tap } from 'rxjs';

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
    NgForOf,
    NgClass,
  ],
  templateUrl: './add-reading-for-switchboard.component.html',
  styleUrl: './add-reading-for-switchboard.component.scss',
})
export class AddReadingForSwitchboardComponent implements OnInit {
  @Input() subscribers!: Subscriber[] | null | undefined;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readingsService: ReadingsService,
    private notifications: NotificationsEmitterService,
    private errorService: ErrorService,
    private translate: TranslateService
  ) {}

  MAX_INT = 2147483647;

  minDateFrom: Date | null = new Date();
  readingsDateFrom: Date | null = null;
  readingsDateTo: Date | null = moment(new Date()).toDate();
  readingsValues: number[] = [];
  firstPhaseValues: number[] = [];
  secondPhaseValues: number[] = [];
  thirdPhaseValues: number[] = [];

  ngOnInit() {
    this.setInitialValues();
  }

  setInitialValues() {
    this.readingsDateFrom = moment().startOf('year').toDate();
    this.minDateFrom = moment().startOf('year').toDate();

    if (this.subscribers?.length) {
      this.subscribers.forEach((subscriber: Subscriber) => {
        if (subscriber.lastRecordDate) {
          if (moment(subscriber.lastRecordDate).isAfter(moment(this.minDateFrom))) {
            this.readingsDateFrom = moment(subscriber.lastRecordDate).toDate();
            this.minDateFrom = moment(subscriber.lastRecordDate).toDate();
          }
        }
      });
    }

    this.readingsValues = new Array(this.subscribers?.length).fill(null);
    setTimeout(() => {
      const inputs = document.querySelectorAll('#readingField');
      (inputs[0] as HTMLElement)?.focus();
    }, 200);
  }

  getBodyToInsertReadings(): InsertMultipleReadings | null {
    const body: InsertMultipleReadings = {
      subscribersReading: [],
    };
    let hasInvalidValues = false;

    this.subscribers?.forEach((subscriber: Subscriber, index: number) => {
      const onePhaseHasValue = subscriber.phaseCount === 1 && this.readingsValues[index];
      const twoPhaseHasValue =
        subscriber.phaseCount === 2 && this.firstPhaseValues[index] && this.secondPhaseValues[index];
      const threePhaseHasValue =
        subscriber.phaseCount === 3 &&
        this.firstPhaseValues[index] &&
        this.secondPhaseValues[index] &&
        this.thirdPhaseValues[index];

      if (onePhaseHasValue || twoPhaseHasValue || threePhaseHasValue) {
        const value = this.calculateReadingValue(subscriber, index);

        if (value !== null) {
          if (subscriber.lastReading && value < subscriber.lastReading) {
            hasInvalidValues = true;
            this.notifications.Info.emit(
              this.translate.instant('SubscriberReadingValueIsLowerThanLastReading', {
                subscriberName: subscriber.name,
              })
            );
          }

          body.subscribersReading.push(this.createReadingEntry(subscriber, value, index));
        }
      }
    });

    if (hasInvalidValues) {
      return null;
    }

    return body;
  }

  calculateReadingValue(subscriber: Subscriber, index: number): number | null {
    if (subscriber.phaseCount === 1 && this.readingsValues[index]) {
      return this.readingsValues[index] || 0;
    } else if (subscriber.phaseCount === 2 && this.firstPhaseValues[index] && this.secondPhaseValues[index]) {
      return (this.firstPhaseValues[index] || 0) + (this.secondPhaseValues[index] || 0);
    } else if (
      subscriber.phaseCount === 3 &&
      this.firstPhaseValues[index] &&
      this.secondPhaseValues[index] &&
      this.thirdPhaseValues[index]
    ) {
      return (
        (this.firstPhaseValues[index] || 0) + (this.secondPhaseValues[index] || 0) + (this.thirdPhaseValues[index] || 0)
      );
    }
    return null;
  }

  createReadingEntry(subscriber: Subscriber, value: number, index: number): any {
    return {
      subscriberId: subscriber.id,
      dateFrom: moment(this.readingsDateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z',
      dateTo: moment(this.readingsDateTo).format('YYYY-MM-DD') + 'T00:00:00.000Z',
      value: value,
      firstPhaseValue: this.firstPhaseValues[index] || 0,
      secondPhaseValue: this.secondPhaseValues[index] || 0,
      thirdPhaseValue: this.thirdPhaseValues[index] || 0,
    };
  }

  addReadings() {
    const body = this.getBodyToInsertReadings();
    if (!body) {
      return;
    } else if (!body.subscribersReading.length) {
      return this.notifications.Info.emit('NoReadingsToInsert');
    }

    this.readingsService
      .insertReadingsForSubscribers(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyAddedReadings');
          this.close.emit();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
