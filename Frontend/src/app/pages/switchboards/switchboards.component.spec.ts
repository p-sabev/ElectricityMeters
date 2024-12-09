import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SwitchboardsComponent } from './switchboards.component';
import { SwitchboardsService } from './switchboards.service';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorService } from '../../core/services/error.service';
import { ConfirmationService } from 'primeng/api';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { of, throwError } from 'rxjs';
import { Switchboard } from '../../core/models/switchboards.model';

describe('SwitchboardsComponent', () => {
  let component: SwitchboardsComponent;
  let fixture: ComponentFixture<SwitchboardsComponent>;
  let switchboardsService: jasmine.SpyObj<SwitchboardsService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let notificationsService: jasmine.SpyObj<NotificationsEmitterService>;
  let tableHelper: jasmine.SpyObj<TableHelperService>;

  const mockSwitchboards: Switchboard[] = [
    { id: 1, name: 'Main Switchboard' },
    { id: 2, name: 'Backup Switchboard' },
    { id: 3, name: 'Test Switchboard' },
  ];

  beforeEach(async () => {
    const switchboardsSpy = jasmine.createSpyObj('SwitchboardsService', ['searchSwitchboards', 'deleteSwitchboard']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['processError']);
    const confirmSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    const notificationsSpy = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const tableHelperSpy = jasmine.createSpyObj('TableHelperService', ['isNoResultsOrNoRecords']);

    notificationsSpy.Success = jasmine.createSpyObj('EventEmitter', ['emit']);

    await TestBed.configureTestingModule({
      imports: [SwitchboardsComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [],
      providers: [
        { provide: SwitchboardsService, useValue: switchboardsSpy },
        { provide: ErrorService, useValue: errorSpy },
        { provide: ConfirmationService, useValue: confirmSpy },
        { provide: NotificationsEmitterService, useValue: notificationsSpy },
        { provide: TableHelperService, useValue: tableHelperSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchboardsComponent);
    component = fixture.componentInstance;
    switchboardsService = TestBed.inject(SwitchboardsService) as jasmine.SpyObj<SwitchboardsService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    notificationsService = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    tableHelper = TestBed.inject(TableHelperService) as jasmine.SpyObj<TableHelperService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch the switchboards list on initialization', () => {
      switchboardsService.searchSwitchboards.and.returnValue(of({ data: mockSwitchboards, totalRecords: 3 }));
      tableHelper.isNoResultsOrNoRecords.and.returnValue({ noRecords: false, noResults: false });

      component.ngOnInit();

      expect(switchboardsService.searchSwitchboards).toHaveBeenCalled();
      expect(component.switchboardsList).toEqual(mockSwitchboards);
      expect(component.noRecords).toBeFalse();
      expect(component.noResults).toBeFalse();
    });

    it('should handle errors when fetching switchboards', () => {
      const error = new Error('Failed to fetch switchboards');
      switchboardsService.searchSwitchboards.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteSwitchboard', () => {
    it('should delete a switchboard and refresh the list', () => {
      const mockSwitchboard: Switchboard = { id: 1, name: 'Main Switchboard' };
      switchboardsService.deleteSwitchboard.and.returnValue(of({}));
      spyOn(component, 'fetchSwitchboardsList');

      component.deleteSwitchboard(mockSwitchboard);

      expect(switchboardsService.deleteSwitchboard).toHaveBeenCalledWith(mockSwitchboard.id);
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyDeletedSwitchboard');
      expect(component.fetchSwitchboardsList).toHaveBeenCalled();
    });

    it('should handle errors when deleting a switchboard', () => {
      const mockSwitchboard: Switchboard = { id: 1, name: 'Main Switchboard' };
      const error = new Error('Failed to delete switchboard');
      switchboardsService.deleteSwitchboard.and.returnValue(throwError(() => error));

      component.deleteSwitchboard(mockSwitchboard);

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('sortByNumericName', () => {
    it('should sort switchboards by numeric names and preserve non-numeric names', () => {
      const unsortedSwitchboards: Switchboard[] = [
        { id: 1, name: '20' },
        { id: 2, name: 'Main Switchboard' },
        { id: 3, name: '10' },
        { id: 4, name: 'Backup Switchboard' },
      ];
      const sortedSwitchboards: Switchboard[] = [
        { id: 3, name: '10' },
        { id: 1, name: '20' },
        { id: 2, name: 'Main Switchboard' },
        { id: 4, name: 'Backup Switchboard' },
      ];

      const result = component.sortByNumericName(unsortedSwitchboards);

      expect(result).toEqual(sortedSwitchboards);
    });
  });
});
