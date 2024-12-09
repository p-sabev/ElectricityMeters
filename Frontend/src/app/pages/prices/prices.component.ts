import { Component } from '@angular/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Price, SearchPrices } from '../../core/models/prices.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorService } from '../../core/services/error.service';
import { ConfirmationService } from 'primeng/api';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { PricesService } from './prices.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AddEditSwitchboardComponent } from '../switchboards/add-edit-switchboard/add-edit-switchboard.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddEditPricesComponent } from './add-edit-prices/add-edit-prices.component';
import { TwoAfterDotPipe } from '../../shared/pipes/two-after-dot/two-after-dot.pipe';
import { PageHeadingComponent } from '../../core/ui/page-heading/page-heading.component';
import { RoleAccessDirective } from '../../shared/directives/role-access/role-access.directive';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FaIconComponent,
    TranslateModule,
    AddEditSwitchboardComponent,
    ConfirmDialogModule,
    AddEditPricesComponent,
    TwoAfterDotPipe,
    PageHeadingComponent,
    RoleAccessDirective,
  ],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss',
})
export class PricesComponent {
  constructor(
    private pricesService: PricesService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private confirmService: ConfirmationService,
    private notifications: NotificationsEmitterService,
    private tableHelper: TableHelperService
  ) {}

  pricesList: Price[] = [];
  sortField = 'dateFrom';
  sortOrder = -1;
  totalRecords = 0;
  lastUsedSettings: any = null;

  addPrice: boolean = false;
  priceForEdit: Price | null = null;

  firstInit: boolean = true;
  noRecords: boolean = false;
  noResults: boolean = false;

  fetchPricesList(settings: any = this.lastUsedSettings) {
    this.lastUsedSettings = settings;
    const body = this.getSearchBodyForPrices(settings);

    this.pricesService
      .searchPrices(body)
      .pipe(
        tap((resp) => {
          this.pricesList = resp?.data || [];
          this.totalRecords = resp?.totalRecords || 0;
          ({ noRecords: this.noRecords, noResults: this.noResults } = this.tableHelper.isNoResultsOrNoRecords(
            this.firstInit,
            this.totalRecords
          ));
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        }),
        finalize(() => {
          this.firstInit = false;
        })
      )
      .subscribe();
  }

  getSearchBodyForPrices(settings: TableLazyLoadEvent): SearchPrices {
    return {
      paging: this.tableHelper.getPagingSettings(settings),
      sorting: this.tableHelper.getSortingSettings(settings),
    };
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
    this.pricesService
      .deletePrice(price.id)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyDeletedPrice');
          this.fetchPricesList();
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
