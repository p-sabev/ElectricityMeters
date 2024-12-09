import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormErrorsComponent } from './form-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

describe('FormErrorsComponent', () => {
  let component: FormErrorsComponent;
  let fixture: ComponentFixture<FormErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorsComponent, TranslateModule.forRoot()],
    }).compileComponents();

    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faExclamationCircle);

    fixture = TestBed.createComponent(FormErrorsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept control as input', () => {
      const control = new FormControl('', [Validators.required, Validators.minLength(3)]);
      component.control = control;
      fixture.detectChanges();
      expect(component.control).toBe(control);
    });

    it('should accept max and min as inputs', () => {
      component.max = 200;
      component.min = 5;
      fixture.detectChanges();
      expect(component.max).toBe(200);
      expect(component.min).toBe(5);
    });

    it('should accept withoutTooltip as input', () => {
      component.withoutTooltip = true;
      fixture.detectChanges();
      expect(component.withoutTooltip).toBeTrue();
    });
  });

  describe('Error Display Logic', () => {
    it('should not display errors when control is valid', () => {
      component.control = new FormControl('valid value', [Validators.required]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.error')).toBeNull();
    });

    it('should not display errors when control is pristine', () => {
      component.control = new FormControl('', [Validators.required]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.error')).toBeNull();
    });
  });
});
