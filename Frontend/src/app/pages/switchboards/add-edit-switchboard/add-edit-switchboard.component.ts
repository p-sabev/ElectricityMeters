import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Switchboard} from "../../../core/models/switchboards.model";
import {SwitchboardsService} from "../switchboards.service";
import {NotificationsEmitterService} from "../../../core/services/notifications.service";
import {ErrorService} from "../../../core/services/error.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {catchError, EMPTY, tap} from "rxjs";

@Component({
  selector: 'app-add-edit-switchboard',
  standalone: true,
  imports: [
    FaIconComponent,
    FormErrorsComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './add-edit-switchboard.component.html',
  styleUrl: './add-edit-switchboard.component.scss'
})
export class AddEditSwitchboardComponent implements OnInit {
  @Input() switchboardToEdit: Switchboard | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private switchboardsService: SwitchboardsService,
              private notifications: NotificationsEmitterService,
              private errorService: ErrorService) {
  }

  addEditForm!: FormGroup;

  ngOnInit() {
    this.initAddEditForm();
  }

  initAddEditForm() {
    this.addEditForm = new FormGroup({
      id: new FormControl<number | null>(this.switchboardToEdit ? this.switchboardToEdit.id : null),
      name: new FormControl<string>(this.switchboardToEdit?.name ? this.switchboardToEdit.name : '', [Validators.required, Validators.maxLength(250)]),
    });
  }

  addSwitchboard() {
    const body = this.addEditForm?.getRawValue() || {};
    this.switchboardsService.insertSwitchboard(body).pipe(
      tap(() => {
        this.notifications.Success.emit('SuccessfullyAddedSwitchboard');
        this.close.emit();
      }),
      catchError((error) => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

  editSwitchboard() {
    const body = this.addEditForm?.getRawValue() || {};
    this.switchboardsService.editSwitchboard(body).pipe(
      tap(() => {
        this.notifications.Success.emit('SuccessfullyEditedSwitchboard');
        this.close.emit();
      }),
      catchError((error) => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

}
