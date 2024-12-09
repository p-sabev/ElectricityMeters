import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadingsComponent } from './readings.component';
import { ReadingsService } from './readings.service';
import { ErrorService } from '../../core/services/error.service';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { of, throwError } from 'rxjs';
import { Reading } from '../../core/models/readings.model';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPrint, faTrash, faTimes, faCheckCircle, faSearch, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Directive, Input } from '@angular/core';

// Mock TranslateDirective
@Directive({
  selector: '[translate]',
})
class MockTranslateDirective {
  @Input('translate') key!: string;
  @Input() translateParams: any;
}

describe('ReadingsComponent', () => {
  let component: ReadingsComponent;
  let fixture: ComponentFixture<ReadingsComponent>;
  let readingsService: jasmine.SpyObj<ReadingsService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let notifications: jasmine.SpyObj<NotificationsEmitterService>;
  let confirmService: jasmine.SpyObj<ConfirmationService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let tableHelper: jasmine.SpyObj<TableHelperService>;

  const mockReadingsList: Reading[] = [
    {
      id: 1,
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-01-31'),
      value: 150,
      isPaid: false,
      feeList: [],
      firstPhaseValue: 10,
      secondPhaseValue: 20,
      thirdPhaseValue: 30,
      amountDue: 60,
      difference: 40,
      currentPrice: 0.5,
      subscriber: {
        id: 1,
        name: 'Test Subscriber 1',
        phaseCount: 1,
        lastRecordDate: new Date(),
        lastReading: 100,
        defaultReading: 50,
        numberPage: 1,
        switchboard: { id: 1, name: 'Switchboard 1' },
      },
    },
  ];

  beforeEach(async () => {
    const readingsServiceMock = jasmine.createSpyObj('ReadingsService', ['searchReadings', 'deleteReading']);
    const errorServiceMock = jasmine.createSpyObj('ErrorService', ['processError']);
    const notificationsMock = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const confirmServiceMock = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    const translateMock = jasmine.createSpyObj('TranslateService', ['get', 'instant'], {
      onLangChange: of({}),
      onTranslationChange: of({}),
      onDefaultLangChange: of({}),
    });
    const tableHelperMock = jasmine.createSpyObj('TableHelperService', [
      'getPagingSettings',
      'getSortingSettings',
      'isNoResultsOrNoRecords',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReadingsComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [MockTranslateDirective],
      providers: [
        { provide: ReadingsService, useValue: readingsServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: NotificationsEmitterService, useValue: notificationsMock },
        { provide: ConfirmationService, useValue: confirmServiceMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: TableHelperService, useValue: tableHelperMock },
      ],
    }).compileComponents();

    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faPrint, faTrash, faTimes, faCheckCircle, faSearch, faFileInvoice);

    fixture = TestBed.createComponent(ReadingsComponent);
    component = fixture.componentInstance;

    readingsService = TestBed.inject(ReadingsService) as jasmine.SpyObj<ReadingsService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    notifications = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    confirmService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    tableHelper = TestBed.inject(TableHelperService) as jasmine.SpyObj<TableHelperService>;

    translate.get.and.returnValue(of({}));
    translate.instant.and.callFake((key: string) => key);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch readings list on initialization', () => {
    readingsService.searchReadings.and.returnValue(of({ data: mockReadingsList, totalRecords: 2 }));
    tableHelper.isNoResultsOrNoRecords.and.returnValue({ noRecords: false, noResults: false });

    component.fetchReadingsList();

    expect(readingsService.searchReadings).toHaveBeenCalled();
    expect(component.readingsList).toEqual(mockReadingsList);
    expect(component.totalRecords).toBe(2);
    expect(component.noRecords).toBeFalse();
    expect(component.noResults).toBeFalse();
  });

  it('should handle error when fetching readings list fails', () => {
    readingsService.searchReadings.and.returnValue(throwError(() => new Error('Error')));

    component.fetchReadingsList();

    expect(readingsService.searchReadings).toHaveBeenCalled();
    expect(errorService.processError).toHaveBeenCalled();
    expect(component.readingsList).toEqual([]);
    expect(component.totalRecords).toBe(0);
  });
});
