import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditPricesComponent } from './add-edit-prices.component';
import { PricesService } from '../prices.service';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Price } from '../../../core/models/prices.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddEditPricesComponent', () => {
  let component: AddEditPricesComponent;
  let fixture: ComponentFixture<AddEditPricesComponent>;
  let pricesService: jasmine.SpyObj<PricesService>;
  let notifications: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  const mockPrice: Price = {
    id: 1,
    priceInLv: 100.5,
    dateFrom: '2023-01-01T00:00:00.000Z',
    dateTo: null,
    note: 'Test note',
    isUsed: false,
  };

  beforeEach(() => {
    const pricesServiceMock = jasmine.createSpyObj('PricesService', ['insertPrice', 'editPrice']);
    const notificationsMock = jasmine.createSpyObj('NotificationsEmitterService', [], {
      Success: new EventEmitter<string>(),
    });
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);

    TestBed.configureTestingModule({
    imports: [AddEditPricesComponent, ReactiveFormsModule],
    providers: [
        { provide: PricesService, useValue: pricesServiceMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
        { provide: ErrorService, useValue: errorServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();

    fixture = TestBed.createComponent(AddEditPricesComponent);
    component = fixture.componentInstance;

    pricesService = TestBed.inject(PricesService) as jasmine.SpyObj<PricesService>;
    notifications = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;

    component.ngOnInit();
  });

  it('should confirm that insertPrice is a spy', () => {
    expect(jasmine.isSpy(pricesService.insertPrice)).toBeTrue();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values when no priceToEdit is provided', () => {
    component.priceToEdit = null;
    const form = component.addEditForm;

    expect(form).toBeDefined();
    expect(form.get('id')?.value).toBeNull();
    expect(form.get('priceInLv')?.value).toBeNull();
    expect(form.get('dateFrom')?.value).toBeTruthy();
    expect(form.get('note')?.value).toBe('');
  });

  it('should initialize form with values from priceToEdit when provided', () => {
    component.priceToEdit = mockPrice;
    component.initAddEditForm();
    const form = component.addEditForm;

    expect(form.get('id')?.value).toBe(mockPrice.id);
    expect(form.get('priceInLv')?.value).toBe(mockPrice.priceInLv);
    expect(form.get('dateFrom')?.value).toEqual(new Date(mockPrice.dateFrom));
    expect(form.get('note')?.value).toBe(mockPrice.note);
  });

  it('should call insertPrice on addPrice', () => {
    pricesService.insertPrice.and.returnValue(of(null));
    spyOn(component.close, 'emit');
    spyOn(notifications.Success, 'emit');

    component.addEditForm.patchValue({
      priceInLv: 200,
      dateFrom: new Date('2023-01-01'),
      note: 'New price',
    });

    component.addPrice();

    expect(pricesService.insertPrice).toHaveBeenCalledWith({
      id: null,
      priceInLv: 200,
      dateFrom: '2023-01-01T00:00:00.000Z',
      note: 'New price',
    });
    expect(notifications.Success.emit).toHaveBeenCalledWith('SuccessfullyAddedPrice');
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should handle error when insertPrice fails', () => {
    pricesService.insertPrice.and.returnValue(throwError(() => new Error('Error')));
    spyOn(component.close, 'emit');
    spyOn(notifications.Success, 'emit');

    component.addEditForm.patchValue({
      priceInLv: 200,
      dateFrom: new Date('2023-01-01'),
      note: 'New price',
    });

    component.addPrice();

    expect(errorService.processError).toHaveBeenCalled();
    expect(notifications.Success.emit).not.toHaveBeenCalled();
    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should call editPrice on editPrice', () => {
    pricesService.editPrice.and.returnValue(of(null));
    spyOn(component.close, 'emit');
    spyOn(notifications.Success, 'emit');

    component.priceToEdit = mockPrice;

    component.addEditForm.patchValue({
      id: 2,
      priceInLv: 150,
      dateFrom: new Date('2023-01-01T00:00:00.000Z'),
      note: 'Updated price',
    });

    component.editPrice();

    expect(pricesService.editPrice).toHaveBeenCalledWith({
      id: 2,
      priceInLv: 150,
      dateFrom: '2023-01-01T00:00:00.000Z',
      note: 'Updated price',
    });
    expect(notifications.Success.emit).toHaveBeenCalledWith('SuccessfullyEditedPrice');
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should handle error when editPrice fails', () => {
    pricesService.editPrice.and.returnValue(throwError(() => new Error('Error')));
    spyOn(notifications.Success, 'emit');
    spyOn(component.close, 'emit');

    component.priceToEdit = mockPrice;

    component.addEditForm.patchValue({
      priceInLv: 150,
      note: 'Updated price',
    });

    component.editPrice();

    expect(errorService.processError).toHaveBeenCalled();
    expect(notifications.Success.emit).not.toHaveBeenCalled();
    expect(component.close.emit).not.toHaveBeenCalled();
  });
});
