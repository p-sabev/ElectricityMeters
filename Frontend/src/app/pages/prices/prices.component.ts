import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss'
})
export class PricesComponent implements OnInit {

  constructor() {}

  prices: any[] = [];

  ngOnInit() {
    this.fetchPricesList();
  }

  fetchPricesList() {
    this.prices = [
      {
        id: 2,
        price: 0.32,
        dateFrom: '2024-05-21T14:10:50.824Z',
        dateTo: null,
        note: 'Нова цена, поради повишение на разходите за поддръжка'
      },
      {
        id: 1,
        price: 0.22,
        dateFrom: '2023-05-21T14:10:50.824Z',
        dateTo: '2024-05-21T14:10:50.824Z',
        note: 'Нова такса от май месец 2023'
      },
    ]
  }
}
