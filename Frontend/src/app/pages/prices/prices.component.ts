import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {CommonModule} from "@angular/common";
import {Price} from "../../core/models/prices.model";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmationService} from "primeng/api";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {PricesService} from "./prices.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AddEditSwitchboardComponent} from "../switchboards/add-edit-switchboard/add-edit-switchboard.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AddEditPricesComponent} from "./add-edit-prices/add-edit-prices.component";

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, TableModule, FaIconComponent, TranslateModule, AddEditSwitchboardComponent, ConfirmDialogModule, AddEditPricesComponent],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss'
})
export class PricesComponent implements OnInit {

  constructor(private pricesService: PricesService,
              private translate: TranslateService,
              private errorService: ErrorService,
              private confirmService: ConfirmationService,
              private notifications: NotificationsEmitterService) {
  }

  pricesList: any[] = [];

  addPrice: boolean = false;
  priceForEdit: Price | null = null;

  ngOnInit() {
    this.fetchPricesList();
  }

  fetchPricesList() {
    this.pricesService.getAllPrices().subscribe(resp => {
      this.pricesList = resp;
    }, (error: any) => {
      this.errorService.processError(error);
    });
  }

  initAddPrice() {
    this.addPrice = true;
  }

  openPriceForEdit(price: Price) {
    this.priceForEdit = price;
  }

  askToDeletePrice(price: Price) {
    const message = 'AreYouSureToDeleteThisPrice';
    const header = 'AreYouSure';
    this.translate.get([message, header]).subscribe((data) => {
      this.confirmService.confirm({
        message: `${data[message]}?`,
        icon: 'fa fa-question-circle-o',
        header: data[header],
        accept: () => {
          this.deletePrice(price);
        },
      });
    });
  }

  deletePrice(price: Price) {
    this.pricesService.deletePrice(price.id).subscribe(() => {
      this.notifications.Success.emit("SuccessfullyDeletedPrice");
      this.fetchPricesList();
    }, error => {
      this.errorService.processError(error);
    });
  }
}
