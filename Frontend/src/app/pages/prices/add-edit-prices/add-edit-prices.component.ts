import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Price } from '../../../core/models/prices.model';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PricesService } from '../prices.service';
import * as moment from 'moment';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorsComponent } from '../../../shared/features/form-errors/form-errors.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-add-edit-prices',
  standalone: true,
  imports: [
    FaIconComponent,
    FormErrorsComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
  ],
  templateUrl: './add-edit-prices.component.html',
  styleUrl: './add-edit-prices.component.scss',
})
export class AddEditPricesComponent implements OnInit {
  @Input() priceToEdit: Price | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private pricesService: PricesService,
    private notifications: NotificationsEmitterService,
    private errorService: ErrorService
  ) {}

  addEditForm!: FormGroup;

  ngOnInit() {
    this.initAddEditForm();
  }

  initAddEditForm() {
    this.addEditForm = new FormGroup({
      id: new FormControl<number | null>(this.priceToEdit ? this.priceToEdit.id : null),
      priceInLv: new FormControl<number | null>(
        {
          value: this.priceToEdit?.priceInLv ? this.priceToEdit.priceInLv : null,
          disabled: this.priceToEdit?.isUsed === true,
        },
        [Validators.required, Validators.max(1000)]
      ),
      dateFrom: new FormControl<any>(
        this.priceToEdit?.dateFrom ? moment(this.priceToEdit.dateFrom).toDate() : moment().toDate(),
        [Validators.required]
      ),
      note: new FormControl<string>(this.priceToEdit?.note ? this.priceToEdit.note : '', [Validators.maxLength(250)]),
    });
  }

  addPrice() {
    const body = this.addEditForm?.getRawValue() || {};
    body.dateFrom = moment(body.dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    this.pricesService
      .insertPrice(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyAddedPrice');
          this.close.emit();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  editPrice() {
    const body = this.addEditForm?.getRawValue() || {};
    body.dateFrom = moment(body.dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    this.pricesService
      .editPrice(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyEditedPrice');
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
