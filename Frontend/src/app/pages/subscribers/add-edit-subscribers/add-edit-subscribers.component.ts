import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscriber, SubscriberAddEdit} from "../../../core/models/subscribers.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubscribersService} from "../subscribers.service";
import {ErrorService} from "../../../core/services/error.service";
import {NotificationsEmitterService} from "../../../core/services/notifications.service";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {ElectricMetersService} from "../../electric-meters/electric-meters.service";
import {ElectricMeter} from "../../../core/models/electric-meters.model";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";

@Component({
  selector: 'app-add-edit-subscribers',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsComponent,
    NgIf
  ],
  templateUrl: './add-edit-subscribers.component.html',
  styleUrl: './add-edit-subscribers.component.scss'
})
export class AddEditSubscribersComponent implements OnInit {
  @Input() subscriberToEdit: Subscriber | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private subscribersService: SubscribersService,
              private electricMetersService: ElectricMetersService,
              private notifications: NotificationsEmitterService,
              private errorService: ErrorService) {
  }

  addEditForm!: FormGroup;

  switchBoardsList: ElectricMeter[] = [];

  ngOnInit() {
    this.initAddEditForm();
    this.getAllElectricMeters();
  }

  initAddEditForm() {
    this.addEditForm = new FormGroup({
      id: new FormControl<number | null>(this.subscriberToEdit ? this.subscriberToEdit.id : null),
      numberPage: new FormControl<number | null>(this.subscriberToEdit ? this.subscriberToEdit.numberPage : null, [Validators.required, Validators.max(500)]),
      name: new FormControl<string>(this.subscriberToEdit?.name ? this.subscriberToEdit.name : '', [Validators.required, Validators.maxLength(250)]),
      electricMeterId: new FormControl<number | null>(this.subscriberToEdit?.electricMeter?.id ? this.subscriberToEdit.electricMeter.id : null, [Validators.required]),
      address: new FormControl<string>(this.subscriberToEdit?.address ? this.subscriberToEdit.address : '', [Validators.maxLength(250)]),
      phone: new FormControl<string>(this.subscriberToEdit?.phone ? this.subscriberToEdit.phone : '', [Validators.maxLength(250)]),
      meterNumber: new FormControl<string>(this.subscriberToEdit?.meterNumber ? this.subscriberToEdit.meterNumber : '', [Validators.maxLength(50)]),
      note: new FormControl<string>(this.subscriberToEdit?.note ? this.subscriberToEdit.note : '', [Validators.maxLength(500)])
    });
  }

  getAllElectricMeters() {
    this.electricMetersService.getAllElectricMeters().subscribe(resp => {
      this.switchBoardsList = resp || [];
    }, error => {
      this.errorService.processError(error);
    });
  }

  addSubscriber() {
    const body = this.addEditForm?.getRawValue() || {};
    this.subscribersService.insertSubscriber(body).subscribe(() => {
      this.notifications.Success.emit('SuccessfullyAddedSubscriber');
      this.close.emit();
    }, error => {
      this.errorService.processError(error);
    })
  }

  editSubscriber() {
    const body = this.addEditForm?.getRawValue() || {};
    this.subscribersService.insertSubscriber(body).subscribe(() => {
      this.notifications.Success.emit('SuccessfullyEditedSubscriber');
      this.close.emit();
    }, error => {
      this.errorService.processError(error);
    })
  }

}
