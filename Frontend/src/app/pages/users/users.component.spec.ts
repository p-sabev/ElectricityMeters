import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { ErrorService } from '../../core/services/error.service';
import { UsersService } from './users.service';
import { TableHelperService } from '../../core/helpers/table-helper.service';
import { of, throwError } from 'rxjs';
import { User } from '../../core/models/users.model';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let errorService: jasmine.SpyObj<ErrorService>;
  let confirmService: jasmine.SpyObj<ConfirmationService>;
  let notificationsService: jasmine.SpyObj<NotificationsEmitterService>;
  let tableHelper: jasmine.SpyObj<TableHelperService>;

  const mockUsers: User[] = [
    { id: '1', name: 'John', middleName: 'A.', lastName: 'Doe', email: 'john.doe@example.com', userName: 'johndoe', roleIds: ['Admin'] },
    { id: '2', name: 'Jane', middleName: 'B.', lastName: 'Smith', email: 'jane.smith@example.com', userName: 'janesmith', roleIds: ['Editor'] },
  ];
  const mockSearchSettings = { first: 0, rows: 10, sortField: 'id', sortOrder: -1 };

  beforeEach(async () => {
    const usersSpy = jasmine.createSpyObj('UsersService', ['searchUsers', 'deleteUser']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['processError']);
    const confirmSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    const notificationsSpy = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const tableHelperSpy = jasmine.createSpyObj('TableHelperService', ['isNoResultsOrNoRecords']);

    notificationsSpy.Success = jasmine.createSpyObj('EventEmitter', ['emit']);

    await TestBed.configureTestingModule({
      imports: [UsersComponent, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: ErrorService, useValue: errorSpy },
        { provide: ConfirmationService, useValue: confirmSpy },
        { provide: NotificationsEmitterService, useValue: notificationsSpy },
        { provide: TableHelperService, useValue: tableHelperSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    confirmService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
    notificationsService = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    tableHelper = TestBed.inject(TableHelperService) as jasmine.SpyObj<TableHelperService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchUsersList', () => {
    it('should fetch the list of users and update the component state', () => {
      const mockResponse = { data: mockUsers, totalRecords: 2 };
      usersService.searchUsers.and.returnValue(of(mockResponse));
      tableHelper.isNoResultsOrNoRecords.and.returnValue({ noRecords: false, noResults: false });

      component.fetchUsersList(mockSearchSettings);

      expect(usersService.searchUsers).toHaveBeenCalledWith({
        paging: { page: 0, pageSize: 10 },
        sorting: { sortProp: 'id', sortDirection: -1 },
        name: '',
      });
      expect(component.usersList).toEqual(mockUsers);
      expect(component.totalRecords).toBe(2);
      expect(component.noRecords).toBeFalse();
      expect(component.noResults).toBeFalse();
    });

    it('should handle errors when fetching users', () => {
      const error = new Error('Failed to fetch users');
      usersService.searchUsers.and.returnValue(throwError(() => error));

      component.fetchUsersList(mockSearchSettings);

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('askToDeleteUser', () => {
    it('should show confirmation dialog and call deleteUser on acceptance', () => {
      const mockUser: User = { id: '1', name: 'John', middleName: 'A.', lastName: 'Doe', email: '', userName: '', roleIds: [] };
      spyOn(component, 'deleteUser');

      confirmService.confirm.and.callFake(({ accept }: any) => accept());
      component.askToDeleteUser(mockUser);

      expect(confirmService.confirm).toHaveBeenCalled();
      expect(component.deleteUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user and refresh the user list', () => {
      const mockUser: User = { id: '1', name: 'John', middleName: 'A.', lastName: 'Doe', email: '', userName: '', roleIds: [] };
      usersService.deleteUser.and.returnValue(of({}));
      spyOn(component, 'fetchUsersList');

      component.deleteUser(mockUser);

      expect(usersService.deleteUser).toHaveBeenCalledWith('1');
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyDeletedUser');
      expect(component.fetchUsersList).toHaveBeenCalled();
    });

    it('should handle errors when deleting a user', () => {
      const mockUser: User = { id: '1', name: 'John', middleName: 'A.', lastName: 'Doe', email: '', userName: '', roleIds: [] };
      const error = new Error('Failed to delete user');
      usersService.deleteUser.and.returnValue(throwError(() => error));

      component.deleteUser(mockUser);

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });
});
