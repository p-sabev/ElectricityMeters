import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role, User } from '../../../core/models/users.model';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorsComponent } from '../../../shared/features/form-errors/form-errors.component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    FaIconComponent,
    FormErrorsComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    MultiSelectModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  @Input() userToEdit!: User;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private usersService: UsersService,
    private notifications: NotificationsEmitterService,
    private errorService: ErrorService
  ) {}

  editForm!: FormGroup;
  rolesList: Role[] = [];

  ngOnInit() {
    this.getAllRoles();
  }

  initEditForm() {
    const userRoles = this.rolesList.filter((role: Role) => this.userToEdit?.roleIds.includes(role.name)) || [];
    this.editForm = new FormGroup({
      id: new FormControl<string | null>(this.userToEdit.id || null),
      name: new FormControl<string>(this.userToEdit?.name ? this.userToEdit.name : '', [
        Validators.required,
        Validators.maxLength(250),
      ]),
      middleName: new FormControl<string>(this.userToEdit?.middleName ? this.userToEdit.middleName : '', [
        Validators.maxLength(250),
      ]),
      lastName: new FormControl<string>(this.userToEdit?.lastName ? this.userToEdit.lastName : '', [
        Validators.maxLength(250),
      ]),
      email: new FormControl<string>(this.userToEdit?.email ? this.userToEdit.email : '', [Validators.maxLength(250)]),
      userName: new FormControl<string>(this.userToEdit?.userName ? this.userToEdit.userName : '', [
        Validators.maxLength(250),
      ]),
      roleIds: new FormControl<Role[]>(userRoles),
    });
  }

  getAllRoles() {
    this.usersService
      .getAllRoles()
      .pipe(
        tap((roles: any) => {
          this.rolesList = roles;
          this.initEditForm();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  editUser() {
    const body = this.editForm?.getRawValue() || {};
    body.roleIds = body.roleIds?.map((role: Role) => role.name);
    this.usersService
      .editUser(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyEditedUser');
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
