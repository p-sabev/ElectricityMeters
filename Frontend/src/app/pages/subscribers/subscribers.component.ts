import {Component, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Subscriber} from "../../core/models/subscribers.model";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {TranslateModule} from "@ngx-translate/core";
import {AddEditSubscribersComponent} from "./add-edit-subscribers/add-edit-subscribers.component";

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
    AddEditSubscribersComponent
  ],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent implements OnInit {

  constructor(private notifications: NotificationsEmitterService) {}

  subscribers: any[] = [];

  addSubscriber: boolean = false;
  subscriberForEdit: Subscriber | null = null;

  ngOnInit() {
    this.fetchPricesList();
    this.notifications.Success.emit('Success');
  }

  fetchPricesList() {
    this.subscribers = [
      {
        id: 2,
        number: 27,
        name: 'Сава Събев',
        switchboard: '1',
        electricMeterNumber: '213',
        address: '',
        phone: '',
        lastReading: '1698',
        lastRecordDate: '2024-05-21T14:10:50.824Z',
        note: ''
      },
      {
        id: 2,
        number: 28,
        name: 'Георги Шошев',
        switchboard: '1',
        electricMeterNumber: '214',
        address: '',
        phone: '',
        lastReading: '2534',
        lastRecordDate: '2024-05-21T14:10:50.824Z',
        note: ''
      },
      {
        id: 2,
        number: 29,
        name: 'Андрей Хаджирадков',
        switchboard: '1',
        electricMeterNumber: '215',
        address: '',
        phone: '',
        lastReading: '12983',
        lastRecordDate: '2024-05-21T14:10:50.824Z',
        note: ''
      },
      {
        id: 2,
        number: 30,
        name: 'Стефан Иванов',
        switchboard: '1',
        electricMeterNumber: '216',
        address: '',
        phone: '',
        lastReading: '254',
        lastRecordDate: '2024-05-21T14:10:50.824Z',
        note: ''
      },
    ]
  }

  initAddSubscriber() {
    this.addSubscriber = true;
  }

  openSubscriberForEdit(subscriber: Subscriber) {
    this.subscriberForEdit = subscriber;
  }

  askToDeleteSubscriber(subscriber: Subscriber) {
    alert('Are you sure');
  }

}
