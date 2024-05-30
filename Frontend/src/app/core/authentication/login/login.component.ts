import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { LogInCredentials, UserSuccessfullLogInCredentials } from "./login.model";
import { StorageService } from "../../services/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [StorageService]
})
export class LoginComponent {

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private router: Router) { }

  isSignUp = false;

  loginModel: LogInCredentials = {
    'email': '',
    'password': ''
  };

  logIn() {
    const data = Object.assign({}, this.loginModel);
    this.authService.login(data).subscribe(resp => {
      const response = JSON.parse(resp);
      this.logUserIntoTheSystem(response);
    });
  }

  logUserIntoTheSystem(userData: UserSuccessfullLogInCredentials) {
    localStorage.setItem('userId', (userData.userId || ''));
    this.setToken(userData.access_token);
    this.setRefreshToken(userData.refresh_token);
    this.router.navigate(['']);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.storageService.Token.emit(token);
  }

  setRefreshToken(refreshToken: string) {
    console.log('RefreshToken', refreshToken);
  }

}
