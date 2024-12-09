import {Component, OnInit} from '@angular/core';
import {DatePipe, LowerCasePipe, NgForOf, NgIf} from "@angular/common";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SearchSubscribersRequest, Subscriber} from "../../core/models/subscribers.model";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AddEditSubscribersComponent} from "./add-edit-subscribers/add-edit-subscribers.component";
import {SubscribersService} from "./subscribers.service";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {
  AddReadingForSubscriberComponent
} from "../readings/add-reading-for-subscriber/add-reading-for-subscriber.component";
import {PageHeadingComponent} from "../../core/ui/page-heading/page-heading.component";
import {FormsModule} from "@angular/forms";
import {Switchboard} from "../../core/models/switchboards.model";
import {SwitchboardsService} from "../switchboards/switchboards.service";
import {DetailsForSubscriberComponent} from "./details-for-subscriber/details-for-subscriber.component";
import {RoleAccessDirective} from "../../shared/directives/role-access/role-access.directive";
import {TableHelperService} from "../../core/helpers/table-helper.service";
import {catchError, EMPTY, tap} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    SharedModule,
    TableModule,
    FaIconComponent,
    TranslateModule,
    AddEditSubscribersComponent,
    ConfirmDialogModule,
    AddReadingForSubscriberComponent,
    PageHeadingComponent,
    LowerCasePipe,
    FormsModule,
    NgForOf,
    DetailsForSubscriberComponent,
    RoleAccessDirective
  ],
  providers: [ConfirmationService],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent implements OnInit {

  constructor(private notifications: NotificationsEmitterService,
              private subscribersService: SubscribersService,
              private errorService: ErrorService,
              private confirmService: ConfirmationService,
              private translate: TranslateService,
              private switchBoardsService: SwitchboardsService,
              private tableHelper: TableHelperService) {
  }

  subscribers: Subscriber[] = [];

  page = 0;
  sortField = 'switchboard';
  sortOrder = 1;
  totalRecords = 0;
  lastUsedSettings: any = null;

  addSubscriber: boolean = false;
  subscriberForEdit: Subscriber | null = null;
  subscriberToAddRecord: Subscriber | null = null;
  subscriberToShowDetailedInfo: Subscriber | null = null;

  filtersModel = {
    numberPage: null,
    name: '',
    switchboard: null,
    electricMeterName: ''
  };

  switchboardsList: Switchboard[] = [];

  firstInit: boolean = true;
  noRecords: boolean = false;
  noResults: boolean = false;

  ngOnInit() {
    this.getAllSwitchboards();
  }

  getAllSwitchboards() {
    this.switchBoardsService.getAllSwitchboards().pipe(
      tap((resp) => {
        this.switchboardsList = resp || [];
      }),
      catchError((error: any) => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

  fetchSubscribersList(settings: any = this.lastUsedSettings) {
    this.lastUsedSettings = settings;
    const body = this.getBodyToDetchSubscribers(settings);

    this.subscribersService.searchSubscribers(body).pipe(
      tap(resp => {
        this.subscribers = resp?.data || [];
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

  getBodyToDetchSubscribers(settings: TableLazyLoadEvent): SearchSubscribersRequest {
    return {
      paging: this.tableHelper.getPagingSettings(settings),
      sorting: this.tableHelper.getSortingSettings(settings),
      numberPage: this.filtersModel.numberPage || null,
      name: this.filtersModel.name || null,
      switchboardId: this.filtersModel.switchboard || null,
      electricMeterName: this.filtersModel.electricMeterName || null,
    };
  }

  initAddSubscriber() {
    this.addSubscriber = true;
  }

  openSubscriberForEdit(subscriber: Subscriber) {
    this.subscriberForEdit = subscriber;
  }

  askToDeleteSubscriber(subscriber: Subscriber) {
    const message = 'AreYouSureToDeleteThisSubscriber';
    const header = 'AreYouSure';
    this.translate.get([message, header]).subscribe((data) => {
      this.confirmService.confirm({
        message: `${data[message]} - ${subscriber.name}?`,
        icon: 'fa fa-question-circle-o',
        header: data[header],
        accept: () => {
          this.deleteSubscriber(subscriber);
        },
      });
    });
  }

  deleteSubscriber(subscriber: Subscriber) {
    this.subscribersService.deleteSubscriber(subscriber.id).pipe(
      tap(() => {
        this.notifications.Success.emit("SuccessfullyDeletedSubscriber");
        this.fetchSubscribersList();
      }),
      catchError((error) => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

}
