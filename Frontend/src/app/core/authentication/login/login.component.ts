import {Component} from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { LogInCredentials, UserSuccessfullLogInCredentials } from "./login.model";
import { StorageService } from "../../services/storage.service";
import {NotificationsEmitterService} from "../../services/notifications.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [StorageService]
})
export class LoginComponent {

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private router: Router,
              private notifications: NotificationsEmitterService) { }

  isSignUp = false;

  loginModel: LogInCredentials = {
    'email': '',
    'password': ''
  };

  logIn() {
    const data = Object.assign({}, this.loginModel);
    this.authService.login(data).subscribe(resp => {
      this.logUserIntoTheSystem(resp);
    }, () => {
      this.notifications.Error.emit('IncorrectUserNameOrPassword');
    });
  }

  logUserIntoTheSystem(userData: UserSuccessfullLogInCredentials) {
    localStorage.setItem('userId', (userData.userId || ''));
    this.setToken(userData.token);
    this.setRoles(userData.roles);
    // this.setRefreshToken(userData.refresh_token);
    this.router.navigate(['']);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.storageService.Token.emit(token);
  }

  setRoles(roles: string[]) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  setRefreshToken(refreshToken: string) {
    console.log('RefreshToken', refreshToken);
  }

}
