import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-electric-meters',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './electric-meters.component.html',
  styleUrl: './electric-meters.component.scss'
})
export class ElectricMetersComponent implements OnInit {

  constructor() {
  }

  electricMetersList: any[] = [];

  ngOnInit() {
    this.fetchElectricMetersList();
  }

  fetchElectricMetersList() {
    this.electricMetersList = [
      {
        switchboard: '1',
        meterSubscribers: [
          {
            id: 27,
            number: 27,
            name: 'Сава Събев',
            address: '',
            phone: '',
            electricMeterNumber: 213,
            note: ''
          },
          {
            id: 28,
            number: 28,
            name: 'Георги Шошев',
            address: '',
            phone: '',
            electricMeterNumber: 214,
            note: ''
          },
          {
            id: 29,
            number: 29,
            name: 'Андрей Хаджирадков',
            address: '',
            phone: '',
            electricMeterNumber: 215,
            note: ''
          },
          {
            id: 30,
            number: 30,
            name: 'Стефан Иванов',
            address: '',
            phone: '',
            electricMeterNumber: 216,
            note: ''
          },
        ]
      },
      {
        switchboard: '2',
        meterSubscribers: [
          {
            id: 27,
            number: 27,
            name: 'Сава Събев',
            address: '',
            phone: '',
            electricMeterNumber: 213,
            note: ''
          },
          {
            id: 28,
            number: 28,
            name: 'Георги Шошев',
            address: '',
            phone: '',
            electricMeterNumber: 214,
            note: ''
          },
          {
            id: 29,
            number: 29,
            name: 'Андрей Хаджирадков',
            address: '',
            phone: '',
            electricMeterNumber: 215,
            note: ''
          },
          {
            id: 30,
            number: 30,
            name: 'Стефан Иванов',
            address: '',
            phone: '',
            electricMeterNumber: 216,
            note: ''
          },
        ]
      },
      {
        switchboard: '3',
        meterSubscribers: [
          {
            id: 27,
            number: 27,
            name: 'Сава Събев',
            address: '',
            phone: '',
            electricMeterNumber: 213,
            note: ''
          },
          {
            id: 28,
            number: 28,
            name: 'Георги Шошев',
            address: '',
            phone: '',
            electricMeterNumber: 214,
            note: ''
          },
          {
            id: 29,
            number: 29,
            name: 'Андрей Хаджирадков',
            address: '',
            phone: '',
            electricMeterNumber: 215,
            note: ''
          },
          {
            id: 30,
            number: 30,
            name: 'Стефан Иванов',
            address: '',
            phone: '',
            electricMeterNumber: 216,
            note: ''
          },
        ]
      },{
        switchboard: '4',
        meterSubscribers: [
          {
            id: 27,
            number: 27,
            name: 'Сава Събев',
            address: '',
            phone: '',
            electricMeterNumber: 213,
            note: ''
          },
          {
            id: 28,
            number: 28,
            name: 'Георги Шошев',
            address: '',
            phone: '',
            electricMeterNumber: 214,
            note: ''
          },
          {
            id: 29,
            number: 29,
            name: 'Андрей Хаджирадков',
            address: '',
            phone: '',
            electricMeterNumber: 215,
            note: ''
          },
          {
            id: 30,
            number: 30,
            name: 'Стефан Иванов',
            address: '',
            phone: '',
            electricMeterNumber: 216,
            note: ''
          },
        ]
      },
      {
        switchboard: '5',
        meterSubscribers: [
          {
            id: 27,
            number: 27,
            name: 'Сава Събев',
            address: '',
            phone: '',
            electricMeterNumber: 213,
            note: ''
          },
          {
            id: 28,
            number: 28,
            name: 'Георги Шошев',
            address: '',
            phone: '',
            electricMeterNumber: 214,
            note: ''
          },
          {
            id: 29,
            number: 29,
            name: 'Андрей Хаджирадков',
            address: '',
            phone: '',
            electricMeterNumber: 215,
            note: ''
          },
          {
            id: 30,
            number: 30,
            name: 'Стефан Иванов',
            address: '',
            phone: '',
            electricMeterNumber: 216,
            note: ''
          },
        ]
      },
      {
        switchboard: '6',
        meterSubscribers: [
          {
            id: 27,
            number: 27,
            name: 'Сава Събев',
            address: '',
            phone: '',
            electricMeterNumber: 213,
            note: ''
          },
          {
            id: 28,
            number: 28,
            name: 'Георги Шошев',
            address: '',
            phone: '',
            electricMeterNumber: 214,
            note: ''
          },
          {
            id: 29,
            number: 29,
            name: 'Андрей Хаджирадков',
            address: '',
            phone: '',
            electricMeterNumber: 215,
            note: ''
          },
          {
            id: 30,
            number: 30,
            name: 'Стефан Иванов',
            address: '',
            phone: '',
            electricMeterNumber: 216,
            note: ''
          },
        ]
      }
    ]
  }
}
