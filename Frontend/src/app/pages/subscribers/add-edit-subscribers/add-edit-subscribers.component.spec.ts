import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddEditSubscribersComponent } from './add-edit-subscribers.component';
import { SubscribersService } from '../subscribers.service';
import { SwitchboardsService } from '../../switchboards/switchboards.service';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { of, throwError } from 'rxjs';

describe('AddEditSubscribersComponent', () => {
  let component: AddEditSubscribersComponent;
  let fixture: ComponentFixture<AddEditSubscribersComponent>;
  let subscribersService: jasmine.SpyObj<SubscribersService>;
  let switchboardsService: jasmine.SpyObj<SwitchboardsService>;
  let notificationsService: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    const subscribersSpy = jasmine.createSpyObj('SubscribersService', ['insertSubscriber', 'editSubscriber']);
    const switchboardsSpy = jasmine.createSpyObj('SwitchboardsService', ['getAllSwitchboards']);
    const notificationsSpy = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['processError']);

    notificationsSpy.Success = jasmine.createSpyObj('EventEmitter', ['emit']); // Mock EventEmitter

    await TestBed.configureTestingModule({
      imports: [AddEditSubscribersComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: SubscribersService, useValue: subscribersSpy },
        { provide: SwitchboardsService, useValue: switchboardsSpy },
        { provide: NotificationsEmitterService, useValue: notificationsSpy },
        { provide: ErrorService, useValue: errorSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditSubscribersComponent);
    component = fixture.componentInstance;
    subscribersService = TestBed.inject(SubscribersService) as jasmine.SpyObj<SubscribersService>;
    switchboardsService = TestBed.inject(SwitchboardsService) as jasmine.SpyObj<SwitchboardsService>;
    notificationsService = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;

    switchboardsService.getAllSwitchboards.and.returnValue(of([]));
    component.initAddEditForm();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('addSubscriber', () => {
    it('should call the service to add a subscriber and emit success notification', () => {
      const mockFormValue = {
        id: 1,
        numberPage: 1,
        name: 'Ivan Ivanov',
        switchboardId: 1,
        address: 'Sofia',
        phone: '0888888888',
        meterNumber: '123456',
        note: 'Note',
        defaultReading: 100,
        phaseCount: 1
      };

      component.addEditForm.setValue(mockFormValue);
      subscribersService.insertSubscriber.and.returnValue(of({}));

      spyOn(component.close, 'emit');

      component.addSubscriber();

      expect(subscribersService.insertSubscriber).toHaveBeenCalledWith(mockFormValue);
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyAddedSubscriber');
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should handle error when adding a subscriber', () => {
      const error = { message: 'Error' };
      subscribersService.insertSubscriber.and.returnValue(throwError(() => error));

      component.addSubscriber();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('editSubscriber', () => {
    it('should call the service to edit a subscriber and emit success notification', () => {
      const mockFormValue = {
        id: 1,
        numberPage: 1,
        name: 'Ivan Ivanov',
        switchboardId: 1,
        address: 'Sofia',
        phone: '0888888888',
        meterNumber: '123456',
        note: 'Note',
        defaultReading: 100,
        phaseCount: 1
      };

      component.addEditForm.setValue(mockFormValue);
      subscribersService.editSubscriber.and.returnValue(of({}));

      spyOn(component.close, 'emit');

      component.editSubscriber();

      expect(subscribersService.editSubscriber).toHaveBeenCalledWith(mockFormValue);
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyEditedSubscriber');
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should handle error when editing a subscriber', () => {
      const error = { message: 'Error' };
      subscribersService.editSubscriber.and.returnValue(throwError(() => error));

      component.editSubscriber();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('Form Validation', () => {
    it('should initialize the form with default values', () => {
      component.ngOnInit();

      expect(component.addEditForm.value).toEqual({
        id: null,
        numberPage: null,
        name: '',
        switchboardId: null,
        address: '',
        phone: '',
        meterNumber: '',
        note: '',
        defaultReading: null,
        phaseCount: 1,
      });
    });

    it('should mark the form as invalid when required fields are missing', () => {
      component.ngOnInit();
      component.addEditForm.patchValue({
        name: '',
        switchboardId: null,
        phaseCount: null,
      });

      expect(component.addEditForm.valid).toBeFalse();
    });
  });
});
