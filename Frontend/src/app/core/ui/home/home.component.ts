import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {TranslateModule} from "@ngx-translate/core";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RoleAccessDirective} from "../../../shared/directives/role-access.directive";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    FaIconComponent,
    RoleAccessDirective
  ]
})
export class HomeComponent implements OnInit {
  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']);
    }
  }

  openRoute(route: string) {
    this.router.navigate([route]);
  }
}
