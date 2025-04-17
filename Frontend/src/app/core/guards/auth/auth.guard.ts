import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (localStorage.getItem('roles')?.length) {
      this.roles = JSON.parse(<string>localStorage.getItem('roles'));
    }

    if (this.authService.isAuthenticated() && this.roles?.length) {
      const roleNeeded = route.data['roleNeeded'] as string;
      return this.getAccess(roleNeeded);
    } else {
      if (localStorage.getItem('withoutLogout')) {
        return this.router.navigate(['/home']);
      } else {
        return this.logOut();
      }
    }
  }

  getAccess(roleNeeded: string) {
    let hasRights = false;
    if (this.roles?.length) {
      this.roles.forEach((role: string) => {
        if (roleNeeded.toLowerCase().includes(role.toLowerCase())) {
          hasRights = true;
        }
      });
    }

    if (!hasRights) {
      this.logOut();
    }
    return hasRights;
  }

  logOut() {
    this.authService.logout(true);
  }
}
