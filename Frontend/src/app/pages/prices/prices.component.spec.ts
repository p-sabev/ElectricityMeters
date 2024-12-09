import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricesComponent } from './prices.component';
import { PricesService } from './prices.service';
import { ErrorService } from '../../core/services/error.service';
import { ConfirmationService } from 'primeng/api';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { Price } from '../../core/models/prices.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';

describe('PricesComponent', () => {
  let component: PricesComponent;
  let fixture: ComponentFixture<PricesComponent>;
  let pricesService: jasmine.SpyObj<PricesService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let confirmService: jasmine.SpyObj<ConfirmationService>;
  let translate: jasmine.SpyObj<TranslateService>;

  const mockPrice: Price = {
    id: 1,
    priceInLv: 100.5,
    dateFrom: new Date('2023-01-01').toISOString(),
    dateTo: new Date('2023-12-31').toISOString(),
    note: 'Test note',
    isUsed: true,
  };

  beforeEach(async () => {
    const pricesServiceMock = jasmine.createSpyObj('PricesService', ['searchPrices', 'deletePrice']);
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);
    const confirmServiceMock = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    const notificationsMock = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const tableHelperMock = jasmine.createSpyObj('TableHelperService', [
      'getPagingSettings',
      'getSortingSettings',
      'isNoResultsOrNoRecords',
    ]);
    const translateMock = jasmine.createSpyObj('TranslateService', ['get']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ConfirmDialogModule, TableModule, PricesComponent],
      providers: [
        { provide: PricesService, useValue: pricesServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: ConfirmationService, useValue: confirmServiceMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
        { provide: TableHelperService, useValue: tableHelperMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PricesComponent);
    component = fixture.componentInstance;

    pricesService = TestBed.inject(PricesService) as jasmine.SpyObj<PricesService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    confirmService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should open price for edit', () => {
    component.openPriceForEdit(mockPrice);
    expect(component.priceForEdit).toEqual(mockPrice);
  });

  it('should ask to delete price', () => {
    translate.get.and.returnValue(
      of({
        AreYouSureToDeleteThisPrice: 'Сигурни ли сте, че искате да изтриете тази цена',
        AreYouSure: 'Сигурни ли сте?',
      })
    );

    component.askToDeletePrice(mockPrice);

    expect(translate.get).toHaveBeenCalled();
    expect(confirmService.confirm).toHaveBeenCalled();
  });

  it('should handle error when deleting price', () => {
    pricesService.deletePrice.and.returnValue(throwError(() => new Error('Error')));

    component.deletePrice(mockPrice);

    expect(errorService.processError).toHaveBeenCalled();
  });
});
