import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscriber} from "../../../core/models/subscribers.model";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubscribersService} from "../subscribers.service";
import {ErrorService} from "../../../core/services/error.service";
import {NotificationsEmitterService} from "../../../core/services/notifications.service";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {SwitchboardsService} from "../../switchboards/switchboards.service";
import {Switchboard} from "../../../core/models/switchboards.model";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

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
    FaIconComponent
  ],
  templateUrl: './add-edit-subscribers.component.html',
  styleUrl: './add-edit-subscribers.component.scss'
})
export class AddEditSubscribersComponent implements OnInit {
  @Input() subscriberToEdit: Subscriber | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private subscribersService: SubscribersService,
              private switchBoardsService: SwitchboardsService,
              private notifications: NotificationsEmitterService,
              private errorService: ErrorService) {
  }

  addEditForm!: FormGroup;

  switchBoardsList: Switchboard[] = [];

  ngOnInit() {
    this.initAddEditForm();
    this.getAllSwitchboards();
  }

  initAddEditForm() {
    this.addEditForm = new FormGroup({
      id: new FormControl<number | null>(this.subscriberToEdit ? this.subscriberToEdit.id : null),
      numberPage: new FormControl<number | null>(this.subscriberToEdit ? this.subscriberToEdit.numberPage : null, [Validators.required, Validators.max(500)]),
      name: new FormControl<string>(this.subscriberToEdit?.name ? this.subscriberToEdit.name : '', [Validators.required, Validators.maxLength(250)]),
      switchboardId: new FormControl<number | null>(this.subscriberToEdit?.switchboard?.id ? this.subscriberToEdit.switchboard.id : null, [Validators.required]),
      address: new FormControl<string>(this.subscriberToEdit?.address ? this.subscriberToEdit.address : '', [Validators.maxLength(250)]),
      phone: new FormControl<string>(this.subscriberToEdit?.phone ? this.subscriberToEdit.phone : '', [Validators.maxLength(250)]),
      meterNumber: new FormControl<string>(this.subscriberToEdit?.meterNumber ? this.subscriberToEdit.meterNumber : '', [Validators.maxLength(50)]),
      note: new FormControl<string>(this.subscriberToEdit?.note ? this.subscriberToEdit.note : '', [Validators.maxLength(500)]),
      defaultReading: new FormControl<number | null | undefined>(this.subscriberToEdit ? this.subscriberToEdit.defaultReading : null, [Validators.min(0)]),
    });
  }

  getAllSwitchboards() {
    this.switchBoardsService.getAllSwitchboards().subscribe(resp => {
      this.switchBoardsList = resp || [];
    }, (error: any) => {
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
    this.subscribersService.editSubscriber(body).subscribe(() => {
      this.notifications.Success.emit('SuccessfullyEditedSubscriber');
      this.close.emit();
    }, error => {
      this.errorService.processError(error);
    })
  }

}
