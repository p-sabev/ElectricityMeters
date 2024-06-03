import {Component, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Subscriber} from "../../core/models/subscribers.model";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AddEditSubscribersComponent} from "./add-edit-subscribers/add-edit-subscribers.component";
import {SubscribersService} from "./subscribers.service";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";

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
    ConfirmDialogModule
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
              private translate: TranslateService) {}

  subscribers: Subscriber[] = [];

  addSubscriber: boolean = false;
  subscriberForEdit: Subscriber | null = null;

  ngOnInit() {
    this.fetchSubscribersList();
  }

  fetchSubscribersList() {
    this.subscribersService.getAllSubscribers().subscribe(resp => {
      this.subscribers = resp;
    }, error => {
      this.errorService.processError(error);
    });
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
    this.subscribersService.deleteSubscriber(subscriber.id).subscribe(() => {
      this.notifications.Success.emit("SuccessfullyDeletedSubscriber");
      this.fetchSubscribersList();
    }, error => {
      this.errorService.processError(error);
    });
  }

}
