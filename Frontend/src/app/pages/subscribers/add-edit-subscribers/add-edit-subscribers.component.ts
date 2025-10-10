import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscriber } from '../../../core/models/subscribers.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscribersService } from '../subscribers.service';
import { ErrorService } from '../../../core/services/error.service';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf, NgIf } from '@angular/common';
import { SwitchboardsService } from '../../switchboards/switchboards.service';
import { Switchboard } from '../../../core/models/switchboards.model';
import { FormErrorsComponent } from '../../../shared/features/form-errors/form-errors.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RadioButtonModule } from 'primeng/radiobutton';
import { catchError, EMPTY, tap } from 'rxjs';
import { TwoAfterDotPipe } from '../../../shared/pipes/two-after-dot/two-after-dot.pipe';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-add-edit-subscribers',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsComponent,
    NgIf,
    NgForOf,
    FaIconComponent,
    RadioButtonModule,
    TwoAfterDotPipe,
    TooltipModule,
  ],
  templateUrl: './add-edit-subscribers.component.html',
  styleUrl: './add-edit-subscribers.component.scss',
})
export class AddEditSubscribersComponent implements OnInit {
  @Input() subscriberToEdit: Subscriber | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private subscribersService: SubscribersService,
    private switchBoardsService: SwitchboardsService,
    private notifications: NotificationsEmitterService,
    private errorService: ErrorService
  ) {}

  addEditForm!: FormGroup;

  switchBoardsList: Switchboard[] = [];

  ngOnInit() {
    this.initAddEditForm();
    this.getAllSwitchboards();
  }

  initAddEditForm() {
    this.addEditForm = new FormGroup({
      id: new FormControl<number | null>(this.subscriberToEdit ? this.subscriberToEdit.id : null),
      numberPage: new FormControl<number | null>(this.subscriberToEdit ? this.subscriberToEdit.numberPage : null, [
        Validators.max(500),
      ]),
      name: new FormControl<string>(this.subscriberToEdit?.name ? this.subscriberToEdit.name : '', [
        Validators.required,
        Validators.maxLength(250),
      ]),
      switchboardId: new FormControl<number | null>(
        this.subscriberToEdit?.switchboard?.id ? this.subscriberToEdit.switchboard.id : null,
        [Validators.required]
      ),
      address: new FormControl<string>(this.subscriberToEdit?.address ? this.subscriberToEdit.address : '', [
        Validators.maxLength(250),
      ]),
      phone: new FormControl<string>(this.subscriberToEdit?.phone ? this.subscriberToEdit.phone : '', [
        Validators.maxLength(250),
      ]),
      meterNumber: new FormControl<string>(
        this.subscriberToEdit?.meterNumber ? this.subscriberToEdit.meterNumber : '',
        [Validators.maxLength(50)]
      ),
      note: new FormControl<string>(this.subscriberToEdit?.note ? this.subscriberToEdit.note : '', [
        Validators.maxLength(500),
      ]),
      defaultReading: new FormControl<number | null | undefined>(
        this.subscriberToEdit ? this.subscriberToEdit.defaultReading : null,
        [Validators.min(0)]
      ),
      readingCoefficient: new FormControl<number | null>(this.subscriberToEdit?.readingCoefficient || null),
      phaseCount: new FormControl<number>(this.subscriberToEdit ? this.subscriberToEdit.phaseCount : 1, [
        Validators.required,
      ]),
      priceApplied: new FormControl<number>(this.getTypePriceApplied(), [Validators.required]),
      individualPrice: new FormControl<number | null>(this.subscriberToEdit?.individualPrice || null),
      individualPricePercent: new FormControl<number | null>(this.subscriberToEdit?.individualPricePercent || null),
    });
    this.priceAppliedChanged(true);
    this.subscribeForPriceAppliedChanges();
  }

  subscribeForPriceAppliedChanges() {
    const priceAppliedControl = this.addEditForm.get('priceApplied');
    priceAppliedControl?.valueChanges.subscribe(() => this.priceAppliedChanged(false));
  }

  getTypePriceApplied(): number {
    if (!this.subscriberToEdit?.individualPrice && !this.subscriberToEdit?.individualPricePercent) {
      return 1;
    } else if (this.subscriberToEdit?.individualPrice) {
      return 2;
    } else if (
      this.subscriberToEdit?.individualPricePercent !== null &&
      this.subscriberToEdit?.individualPricePercent !== undefined
    ) {
      return 3;
    }
    return 1;
  }

  priceAppliedChanged(fromInit = false) {
    const priceApplied = this.addEditForm.get('priceApplied')?.value || 1;
    console.log(priceApplied);
    if (priceApplied === 1) {
      if (!fromInit) {
        this.addEditForm.get('individualPrice')?.setValue(null);
        this.addEditForm.get('individualPricePercent')?.setValue(null);
      }
      this.addEditForm.get('individualPrice')?.setValidators([]);
      this.addEditForm.get('individualPricePercent')?.setValidators([]);
    } else if (priceApplied === 2) {
      if (!fromInit) {
        this.addEditForm.get('individualPrice')?.setValue(this.subscriberToEdit?.individualPrice || null);
        this.addEditForm.get('individualPricePercent')?.setValue(null);
      }
      this.addEditForm.get('individualPrice')?.setValidators([Validators.required, Validators.max(1000)]);
      this.addEditForm.get('individualPricePercent')?.setValidators([]);
    } else if (priceApplied === 3) {
      if (!fromInit) {
        this.addEditForm.get('individualPricePercent')?.setValue(this.subscriberToEdit?.individualPricePercent || 100);
        this.addEditForm.get('individualPrice')?.setValue(null);
      }
      this.addEditForm
        .get('individualPricePercent')
        ?.setValidators([Validators.required, Validators.min(-100), Validators.max(100000)]);
      this.addEditForm.get('individualPrice')?.setValidators([]);
    }

    this.addEditForm.get('individualPrice')?.updateValueAndValidity();
    this.addEditForm.get('individualPricePercent')?.updateValueAndValidity();
  }

  getAllSwitchboards() {
    this.switchBoardsService
      .getAllSwitchboards()
      .pipe(
        tap((resp) => {
          this.switchBoardsList = resp || [];
        }),
        catchError((error: any) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  addSubscriber() {
    const body = this.addEditForm?.getRawValue() || {};
    this.subscribersService
      .insertSubscriber(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyAddedSubscriber');
          this.close.emit();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  editSubscriber() {
    const body = this.addEditForm?.getRawValue() || {};
    this.subscribersService
      .editSubscriber(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyEditedSubscriber');
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
