import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddEditSwitchboardComponent } from './add-edit-switchboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SwitchboardsService } from '../switchboards.service';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { ErrorService } from '../../../core/services/error.service';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

describe('AddEditSwitchboardComponent', () => {
  let component: AddEditSwitchboardComponent;
  let fixture: ComponentFixture<AddEditSwitchboardComponent>;
  let switchboardsService: jasmine.SpyObj<SwitchboardsService>;
  let notificationsService: jasmine.SpyObj<NotificationsEmitterService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  const mockSwitchboard = { id: 1, name: 'Main Switchboard' };

  beforeEach(async () => {
    const switchboardsSpy = jasmine.createSpyObj('SwitchboardsService', [
      'insertSwitchboard',
      'editSwitchboard',
    ]);
    const notificationsSpy = jasmine.createSpyObj('NotificationsEmitterService', ['Success']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['processError']);

    notificationsSpy.Success = jasmine.createSpyObj('EventEmitter', ['emit']);

    await TestBed.configureTestingModule({
      imports: [AddEditSwitchboardComponent, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [],
      providers: [
        { provide: SwitchboardsService, useValue: switchboardsSpy },
        { provide: NotificationsEmitterService, useValue: notificationsSpy },
        { provide: ErrorService, useValue: errorSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditSwitchboardComponent);
    component = fixture.componentInstance;
    switchboardsService = TestBed.inject(SwitchboardsService) as jasmine.SpyObj<SwitchboardsService>;
    notificationsService = TestBed.inject(NotificationsEmitterService) as jasmine.SpyObj<NotificationsEmitterService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  beforeEach(() => {
    component.ngOnInit(); // Initialize the form
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the form with default values when switchboardToEdit is null', () => {
      component.switchboardToEdit = null;

      component.ngOnInit();

      expect(component.addEditForm.value).toEqual({
        id: null,
        name: '',
      });
    });

    it('should initialize the form with switchboard values when switchboardToEdit is provided', () => {
      component.switchboardToEdit = mockSwitchboard;

      component.ngOnInit();

      expect(component.addEditForm.value).toEqual({
        id: mockSwitchboard.id,
        name: mockSwitchboard.name,
      });
    });
  });

  describe('addSwitchboard', () => {
    it('should call the service to add a switchboard and emit success notification', () => {
      const mockFormValue = { id: null, name: 'New Switchboard' };
      component.addEditForm.setValue(mockFormValue);
      switchboardsService.insertSwitchboard.and.returnValue(of({}));

      spyOn(component.close, 'emit');

      component.addSwitchboard();

      expect(switchboardsService.insertSwitchboard).toHaveBeenCalledWith(mockFormValue);
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyAddedSwitchboard');
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should handle errors when adding a switchboard', () => {
      const mockFormValue = { id: null, name: 'New Switchboard' };
      component.addEditForm.setValue(mockFormValue);
      const error = new Error('Failed to add switchboard');
      switchboardsService.insertSwitchboard.and.returnValue(throwError(() => error));

      component.addSwitchboard();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('editSwitchboard', () => {
    it('should call the service to edit a switchboard and emit success notification', () => {
      const mockFormValue = { id: 1, name: 'Updated Switchboard' };
      component.addEditForm.setValue(mockFormValue);
      switchboardsService.editSwitchboard.and.returnValue(of({}));

      spyOn(component.close, 'emit');

      component.editSwitchboard();

      expect(switchboardsService.editSwitchboard).toHaveBeenCalledWith(mockFormValue);
      expect(notificationsService.Success.emit).toHaveBeenCalledWith('SuccessfullyEditedSwitchboard');
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('should handle errors when editing a switchboard', () => {
      const mockFormValue = { id: 1, name: 'Updated Switchboard' };
      component.addEditForm.setValue(mockFormValue);
      const error = new Error('Failed to edit switchboard');
      switchboardsService.editSwitchboard.and.returnValue(throwError(() => error));

      component.editSwitchboard();

      expect(errorService.processError).toHaveBeenCalledWith(error);
    });
  });

  describe('Form Validation', () => {
    it('should mark the form as invalid when required fields are missing', () => {
      component.addEditForm.patchValue({ name: '' });

      expect(component.addEditForm.valid).toBeFalse();
    });

    it('should mark the form as valid when required fields are provided', () => {
      component.addEditForm.patchValue({ name: 'Valid Switchboard' });

      expect(component.addEditForm.valid).toBeTrue();
    });
  });
});
