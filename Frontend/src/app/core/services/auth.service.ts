import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import {LogInCredentials} from "../authentication/login/login.model";

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== 'null' && token !== null;
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  login(credentials: LogInCredentials): Observable<any> {
    return this.http.post(`/api/api/v1/auth/authenticate`, credentials);
  }

  // login(data) {
  //   return this.http.post('/container/Account/Login', data, { responseType: 'text' });
  // }

  logout(goToLoginForm = false) {
    localStorage.removeItem('token');
    if (goToLoginForm) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/home']);
    }
    setTimeout(() => {
      localStorage.removeItem('token');
      this.storageService.Token.emit(null);
      localStorage.removeItem('permissions');
      localStorage.removeItem('permissionsFlat');
      localStorage.removeItem('rolesFlat');

      this.clearLocalStorage();
    }, 100);
  }

  clearLocalStorage() {
    const items = { ...localStorage };
    for (const key in items) {
      if (
        key &&
        !(
          key === 'language' ||
          key === 'withoutLogout' ||
          key === 'userAuth' ||
          key === 'token' ||
          key === 'permissions' ||
          key === 'permissionsFlat' ||
          key === 'rolesFlat'
        )
      ) {
        localStorage.removeItem(key);
      }
    }

    const auth = JSON.parse(localStorage.getItem('userAuth') || '');
    if (!auth || !auth.rememberMe) {
      localStorage.removeItem('userAuth');
    }
  }

  isTokenValid() {
    return this.http.get('/container/Account/IsTokenValid', { params: { dontShowLoader: 'true' } });
  }

  changePassword(body: any) {
    return this.http.post('/container/Account/ChangePassword', body);
  }

  forgottenPassword(body: { email: string; siteCode: string }) {
    return this.http.post(`/container/Account/GenerateForgottenPasswordMail`, body);
  }
  changeForgottenPassword(body: any) {
    return this.http.post('/container/Account/ChangePasswordFromMail', body);
  }

  getExpirationMinutes() {
    return this.http.get('/container/Account/JwtExpireMinutes', { params: { dontShowLoader: 'true' } });
  }

  refreshToken() {
    return this.http.get('/container/Account/GetRefreshToken', {
      responseType: 'text',
      params: { dontShowLoader: 'true' },
    });
  }

}
