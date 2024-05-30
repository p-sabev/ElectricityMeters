import {Component, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    SharedModule,
    TableModule
  ],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent implements OnInit {

  constructor() {}

  subscribers: any[] = [];

  ngOnInit() {
    this.fetchPricesList();
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

}
