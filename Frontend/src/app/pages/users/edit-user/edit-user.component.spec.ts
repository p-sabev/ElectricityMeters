import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../users.service';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { Role, User } from '../../../core/models/users.model';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let notificationsService: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  const mockRoles: Role[] = [
    { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Admin' },
    { id: 'b2c3d4e5-f678-90ab-cdef-1234567890ab', name: 'Moderator' },
    { id: 'c3d4e5f6-7890-abcd-ef12-34567890abcd', name: 'Basic' },
  ];

  const mockUser: User = {
    id: '1',
    name: 'John',
    middleName: 'A.',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userName: 'johndoe',
    roleIds: ['Admin', 'Editor'],
  };

  beforeEach(async () => {
    const usersSpy = jasmine.createSpyObj('UsersService', ['getAllRoles', 'editUser']);
    const notificationsSpy = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['processError']);

    notificationsSpy.Success = jasmine.createSpyObj('EventEmitter', ['emit']);

    await TestBed.configureTestingModule({
      imports: [EditUserComponent, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: NotificationsEmitterService, useValue: notificationsSpy },
        { provide: ErrorService, useValue: errorSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    notificationsService = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  beforeEach(() => {
    component.userToEdit = mockUser; // Set the input for the component
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch roles and initialize the form', () => {
      usersService.getAllRoles.and.returnValue(of(mockRoles));

      component.ngOnInit();

      expect(usersService.getAllRoles).toHaveBeenCalled();
      expect(component.rolesList).toEqual(mockRoles);
      expect(component.editForm.value).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        middleName: mockUser.middleName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        userName: mockUser.userName,
        roleIds: mockRoles.filter((role) => mockUser.roleIds.includes(role.name)),
      });
    });

    it('should handle errors when fetching roles', () => {
      const error = new Error('Failed to fetch roles');
      usersService.getAllRoles.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(usersService.getAllRoles).toHaveBeenCalled();
      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('editUser', () => {
    beforeEach(() => {
      usersService.getAllRoles.and.returnValue(of(mockRoles));
      component.ngOnInit();
    });

    it('should call the service to edit the user and emit success notification', () => {
      const mockFormValue = {
        id: mockUser.id,
        name: 'Updated Name',
        middleName: 'B.',
        lastName: 'Smith',
        email: 'updated@example.com',
        userName: 'updateduser',
        roleIds: [],
      };

      component.editForm.setValue(mockFormValue);
      usersService.editUser.and.returnValue(of({}));

      spyOn(component.close, 'emit');

      component.editUser();

      const expectedBody = {
        ...mockFormValue,
        roleIds: [],
      };

      expect(usersService.editUser).toHaveBeenCalledWith(expectedBody);
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyEditedUser');
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should handle errors when editing a user', () => {
      const error = new Error('Failed to edit user');
      usersService.editUser.and.returnValue(throwError(() => error));

      component.editUser();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      usersService.getAllRoles.and.returnValue(of(mockRoles));
      component.ngOnInit();
    });

    it('should mark the form as invalid when required fields are missing', () => {
      component.editForm.patchValue({ name: '', email: '' });

      expect(component.editForm.valid).toBeFalse();
    });

    it('should mark the form as valid when required fields are provided', () => {
      component.editForm.patchValue({
        name: 'Valid Name',
        email: 'valid@example.com',
      });

      expect(component.editForm.valid).toBeTrue();
    });
  });
});
