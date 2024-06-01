import { Component, Input } from '@angular/core';
import { AbstractControl, NgModel } from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    NgClass
  ]
})
export class FormErrorsComponent {
  @Input() control!: AbstractControl | NgModel | null | undefined;
  @Input() max: any = '100';
  @Input() min: any = '3';
  @Input() withoutTooltip = false;
}
