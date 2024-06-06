import { Component } from '@angular/core';
import {PageHeadingComponent} from "../../core/ui/page-heading/page-heading.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    PageHeadingComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
