import {Component} from '@angular/core';
import {PageHeadingComponent} from "../../core/ui/page-heading/page-heading.component";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {UsersService} from "./users.service";
import {User} from "../../core/models/users.model";
import {DatePipe, LowerCasePipe, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RoleAccessDirective} from "../../shared/directives/role-access/role-access.directive";
import {TableModule} from "primeng/table";
import {TwoAfterDotPipe} from "../../shared/pipes/two-after-dot/two-after-dot.pipe";
import {EditUserComponent} from "./edit-user/edit-user.component";
import {TableHelperService} from "../../core/helpers/table-helper.service";
import {catchError, EMPTY, tap} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    PageHeadingComponent,
    DatePipe,
    FaIconComponent,
    LowerCasePipe,
    ReactiveFormsModule,
    RoleAccessDirective,
    SharedModule,
    TableModule,
    TranslateModule,
    TwoAfterDotPipe,
    FormsModule,
    EditUserComponent,
    NgIf
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(private usersService: UsersService,
              private errorService: ErrorService,
              private confirmService: ConfirmationService,
              private translate: TranslateService,
              private notifications: NotificationsEmitterService,
              private tableHelper: TableHelperService) {
  }

  usersList: User[] = [];

  page = 0;
  sortField = 'id';
  sortOrder = -1;
  totalRecords = 0;
  firstInit: boolean = true;
  noRecords: boolean = false;
  noResults: boolean = false;
  lastUsedSettings: any = null;
  searchUserByName: string = '';

  userToEdit: User | null = null;

  fetchUsersList(settings: any = this.lastUsedSettings) {
    this.lastUsedSettings = settings;
    const body = {
      paging: {
        page: settings.first / settings.rows,
        pageSize: settings.rows
      },
      sorting: {
        sortProp: settings.sortField,
        sortDirection: settings.sortOrder
      },
      name: this.searchUserByName
    }
    this.usersService.searchUsers(body).pipe(
      tap(resp => {
        this.usersList = resp?.data || [];
        this.totalRecords = resp?.totalRecords || 0;
        ({
          noRecords: this.noRecords,
          noResults: this.noResults
        } = this.tableHelper.isNoResultsOrNoRecords(this.firstInit, this.totalRecords));
      }),
      catchError(error => {
        this.errorService.processError(error);
        return EMPTY;
      }),
      finalize(() => {
        this.firstInit = false;
      })
    ).subscribe();
  }

  askToDeleteUser(user: User) {
    const message = 'AreYouSureToDeleteThisUser';
    const header = 'AreYouSure';
    this.translate.get([message, header]).subscribe((data) => {
      this.confirmService.confirm({
        message: `${data[message]} ${user.name} ${user.lastName}?`,
        icon: 'fa fa-question-circle-o',
        header: data[header],
        accept: () => {
          this.deleteUser(user);
        },
      });
    });
  }

  deleteUser(user: User) {
    this.usersService.deleteUser(user.id).pipe(
      tap(() => {
        this.notifications.Success.emit("SuccessfullyDeletedUser");
        this.fetchUsersList();
      }),
      catchError((error) => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

}
