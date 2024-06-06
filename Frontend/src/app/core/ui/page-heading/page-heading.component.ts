import {Component, Input} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-page-heading',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './page-heading.component.html',
  styleUrl: './page-heading.component.scss'
})
export class PageHeadingComponent {
  @Input() title!: string;
}
