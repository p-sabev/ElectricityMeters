import { Injectable } from '@angular/core';
import { NotificationsEmitterService } from './notifications.service';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(
    private notification: NotificationsEmitterService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  processError(error: any) {
    console.log(error);
    if (error.status === 504) {
      this.notification.Error.emit(error.statusText);
    } else if (error.status === 502) {
      this.notification.Error.emit(error.statusText);
    } else if (error.status === 500) {
      this.notification.Error.emit(error.statusText);
    } else if (error.status === 404) {
      this.notification.Error.emit(error.statusText);
    } else if (error.status === 403) {
      this.notification.Error.emit({ key: 'Forbidden', message: 'Error' });
      if (localStorage.getItem('withoutLogout')) {
        this.router.navigate(['/home']);
        this.removeFlagWithoutLogout();
      } else {
        localStorage.setItem('lastLocationPath', window.location.pathname);
        this.authService.logout(true);
      }
    } else if (error.status === 401) {
      if (localStorage.getItem('withoutLogout')) {
        this.router.navigate(['/home']);
        this.removeFlagWithoutLogout();
      } else {
        this.notification.Info.emit("YouHaveToLogInToProceed");
        this.route.data.subscribe((data) => {
          if (data['title'] !== 'LogIn') {
            this.notification.InfoDebounce.emit({ key: 'Unauthorized', message: 'Error' });
            localStorage.setItem('lastLocationPath', window.location.pathname);
            this.authService.logout(true);
          } else {
            this.authService.logout(true);
          }
        });
      }
    } else if (error.status === 400) {
      if (error.error && typeof error.error === 'string') {
        if (this.isJsonString(error.error)) {
          this.notification.Error.emit(JSON.parse(error.error));
        } else {
          this.notification.Error.emit(error.error);
        }
      } else if (error.error && typeof error.error === 'object') {
        if (error.error.key && error.error.message) {
          if (error.error.message === 'Info') {
            this.notification.Info.emit(error.error.key + error.error.message);
          } else {
            this.notification.Error.emit(error.error);
          }
        } else {
          if (Object.keys(error.error)) {
            Object.keys(error.error).map((e) => {
              if (typeof error.error[e] === 'string') {
                this.notification.Error.emit({ key: e, message: error.error[e] });
              } else if (error.error[e] instanceof Array) {
                error.error[e].forEach((message: any) => {
                  this.notification.Error.emit({ key: e, message: message });
                });
              } else {
                console.warn('Unhandled error in error service!', error);
              }
            });
          } else {
            console.warn('Unhandled error in error service!', error);
          }
        }
      }
    } else {
      console.warn('Unhandled error in error service!', error);
    }
  }

  processErrorLicense(err: any) {
    const msgError = err.error;
    if (msgError !== null) {
      const { key } = msgError;
      const msg = msgError.message;
      switch (key && msg) {
        case 'License' && 'LicenseDateExpired': {
          this.notification.Error.emit('LicenseDateError');
          break;
        }
        case 'License' && 'SiteLicenseReached': {
          this.notification.Error.emit('SiteLicenseReachedError');
          break;
        }
        case 'License' && 'Wrong': {
          this.notification.Error.emit('LicenseError');
          break;
        }
        default: {
          this.notification.Error.emit('LicenseError');
          break;
        }
      }
    }
  }
  processErrorSite(err: any) {
    const msgError = err.error;
    if (msgError !== null) {
      const { key } = msgError;
      const msg = msgError.message;
      switch (key && msg) {
        case 'Code' && 'Dublicate': {
          this.notification.Error.emit('CodeDuplicate');
          break;
        }
        case 'Name' && 'NotUnique': {
          this.notification.Error.emit('NameNotUnique');
          break;
        }
        case 'License' && 'LicenseDateExpired': {
          this.notification.Error.emit('LicenseDateError');
          break;
        }
        case 'License' && 'SiteLicenseReached': {
          this.notification.Error.emit('SiteLicenseReachedError');
          break;
        }
        case 'License' && 'Wrong': {
          this.notification.Error.emit('LicenseError');
          break;
        }
        default: {
          this.notification.Error.emit('Unhandled error in error service');
          break;
        }
      }
    }
  }

  removeFlagWithoutLogout() {
    setTimeout(() => {
      localStorage.removeItem('withoutLogout');
    }, 1500);
  }

  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
