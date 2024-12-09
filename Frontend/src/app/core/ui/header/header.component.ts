import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterModule} from "@angular/router";
import { filter, map, mergeMap } from 'rxjs/operators';
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../services/auth.service";
import {TranslateModule, TranslatePipe} from "@ngx-translate/core";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RoleAccessDirective} from "../../../shared/directives/role-access/role-access.directive";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    FaIconComponent,
    RoleAccessDirective,
    NgClass,
    NgIf,
    RouterModule
  ]
})
export class HeaderComponent implements OnInit{

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleDom: Title,
    public authService: AuthService
  ) { }

  collapseMenu = true;

  ngOnInit() {
    this.subscribeToChangesInPage();
  }

  subscribeToChangesInPage() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        this.titleDom.setTitle(event['title']);
      });
  }

  logOut() {
    this.authService.logout(true);
  }
}
