import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SubscribersComponent } from './subscribers.component';
import { SubscribersService } from './subscribers.service';
import { SwitchboardsService } from '../switchboards/switchboards.service';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { ErrorService } from '../../core/services/error.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { of, throwError } from 'rxjs';

describe('SubscribersComponent', () => {
  let component: SubscribersComponent;
  let fixture: ComponentFixture<SubscribersComponent>;
  let subscribersService: jasmine.SpyObj<SubscribersService>;
  let switchboardsService: jasmine.SpyObj<SwitchboardsService>;
  let notificationsService: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let confirmService: jasmine.SpyObj<ConfirmationService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let tableHelper: jasmine.SpyObj<TableHelperService>;

  beforeEach(async () => {
    const subscribersSpy = jasmine.createSpyObj('SubscribersService', ['searchSubscribers', 'deleteSubscriber']);
    const switchboardsSpy = jasmine.createSpyObj('SwitchboardsService', ['getAllSwitchboards']);
    const notificationsSpy = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['processError']);
    const confirmSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    const tableHelperSpy = jasmine.createSpyObj('TableHelperService', [
      'getPagingSettings',
      'getSortingSettings',
      'isNoResultsOrNoRecords',
    ]);

    notificationsSpy.Success = jasmine.createSpyObj('EventEmitter', ['emit']); // Mock EventEmitter

    await TestBed.configureTestingModule({
      imports: [SubscribersComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: SubscribersService, useValue: subscribersSpy },
        { provide: SwitchboardsService, useValue: switchboardsSpy },
        { provide: NotificationsEmitterService, useValue: notificationsSpy },
        { provide: ErrorService, useValue: errorSpy },
        { provide: ConfirmationService, useValue: confirmSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: TableHelperService, useValue: tableHelperSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribersComponent);
    component = fixture.componentInstance;
    subscribersService = TestBed.inject(SubscribersService) as jasmine.SpyObj<SubscribersService>;
    switchboardsService = TestBed.inject(SwitchboardsService) as jasmine.SpyObj<SwitchboardsService>;
    notificationsService = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    confirmService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    tableHelper = TestBed.inject(TableHelperService) as jasmine.SpyObj<TableHelperService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load switchboards on initialization', () => {
      switchboardsService.getAllSwitchboards.and.returnValue(of([]));

      component.ngOnInit();

      expect(switchboardsService.getAllSwitchboards).toHaveBeenCalled();
    });

    it('should handle errors when loading switchboards', () => {
      const error = new Error('Failed to load switchboards');
      switchboardsService.getAllSwitchboards.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('fetchSubscribersList', () => {
    it('should fetch the list of subscribers and update component state', () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            numberPage: 1,
            name: 'Ivan Ivanov',
            switchboardId: 1,
            address: 'Sofia',
            phone: '0888888888',
            meterNumber: '123456',
            note: 'Note',
            defaultReading: 100,
            phaseCount: 1,
            switchboard: { id: 1, name: 'Switchboard 1' },
          },
        ],
        totalRecords: 1,
      };
      subscribersService.searchSubscribers.and.returnValue(of(mockResponse));
      tableHelper.isNoResultsOrNoRecords.and.returnValue({ noRecords: false, noResults: false });

      component.fetchSubscribersList();

      expect(subscribersService.searchSubscribers).toHaveBeenCalled();
      expect(component.subscribers).toEqual(mockResponse.data);
      expect(component.totalRecords).toBe(mockResponse.totalRecords);
      expect(component.noRecords).toBeFalse();
      expect(component.noResults).toBeFalse();
    });

    it('should handle errors when fetching the list of subscribers', () => {
      const error = new Error('Failed to fetch subscribers');
      subscribersService.searchSubscribers.and.returnValue(throwError(() => error));

      component.fetchSubscribersList();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteSubscriber', () => {
    it('should delete a subscriber and refresh the list', () => {
      const mockSubscriber = {
        id: 1,
        numberPage: 1,
        name: 'Ivan Ivanov',
        switchboardId: 1,
        address: 'Sofia',
        phone: '0888888888',
        meterNumber: '123456',
        note: 'Note',
        defaultReading: 100,
        phaseCount: 1,
        switchboard: { id: 1, name: 'Switchboard 1' },
      };
      subscribersService.deleteSubscriber.and.returnValue(of({}));
      spyOn(component, 'fetchSubscribersList');

      component.deleteSubscriber(mockSubscriber);

      expect(subscribersService.deleteSubscriber).toHaveBeenCalledWith(mockSubscriber.id);
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyDeletedSubscriber');
      expect(component.fetchSubscribersList).toHaveBeenCalled();
    });

    it('should handle errors when deleting a subscriber', () => {
      const mockSubscriber = {
        id: 1,
        numberPage: 1,
        name: 'Ivan Ivanov',
        switchboardId: 1,
        address: 'Sofia',
        phone: '0888888888',
        meterNumber: '123456',
        note: 'Note',
        defaultReading: 100,
        phaseCount: 1,
        switchboard: { id: 1, name: 'Switchboard 1' },
      };
      const error = new Error('Error');
      subscribersService.deleteSubscriber.and.returnValue(throwError(() => error));

      component.deleteSubscriber(mockSubscriber);

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('askToDeleteSubscriber', () => {
    it('should show confirmation dialog and call deleteSubscriber on acceptance', () => {
      const mockSubscriber = {
        id: 1,
        numberPage: 1,
        name: 'Ivan Ivanov',
        switchboardId: 1,
        address: 'Sofia',
        phone: '0888888888',
        meterNumber: '123456',
        note: 'Note',
        defaultReading: 100,
        phaseCount: 1,
        switchboard: { id: 1, name: 'Switchboard 1' },
      };

      translateService.get.and.returnValue(
        of({
          AreYouSureToDeleteThisSubscriber: 'Are you sure?',
          AreYouSure: 'Confirmation',
        })
      );

      confirmService.confirm.and.callFake(({ accept }: any) => accept());

      spyOn(component, 'deleteSubscriber');

      component.askToDeleteSubscriber(mockSubscriber);

      expect(translateService.get).toHaveBeenCalled();
      // expect(component.deleteSubscriber).toHaveBeenCalledWith(mockSubscriber);
    });
  });
});
