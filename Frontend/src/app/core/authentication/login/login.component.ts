import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogInCredentials, UserSuccessfullLogInCredentials } from './login.model';
import { StorageService } from '../../services/storage.service';
import { NotificationsEmitterService } from '../../services/notifications.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [StorageService],
  imports: [NgClass, FormsModule],
  standalone: true,
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private notifications: NotificationsEmitterService,
    private translate: TranslateService
  ) {}

  isSignUp = false;

  loginModel: LogInCredentials = {
    email: '',
    password: '',
  };

  logIn() {
    const data = Object.assign({}, this.loginModel);
    this.authService.login(data).subscribe({
      next: (resp) => {
        this.logUserIntoTheSystem(resp);
      },
      error: (err: any) => {
        if (err.status === 400) {
          this.notifications.Error.emit('IncorrectUserNameOrPassword');
        } else {
          console.log(err);
          const msg = this.translate.instant('HttpErrorWithCode', {code: err.status, msg: err.message});
          this.notifications.ErrorNoTranslate.emit(msg);
        }

      },
    });
  }

  logUserIntoTheSystem(userData: UserSuccessfullLogInCredentials) {
    localStorage.setItem('userId', userData.userId || '');
    this.setToken(userData.token);
    this.setRoles(userData.roles);
    this.router.navigate(['']);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.storageService.Token.emit(token);
  }

  setRoles(roles: string[]) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
}
