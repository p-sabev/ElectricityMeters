import {Component, OnInit} from '@angular/core';
import {NotificationsEmitterService} from "./core/services/notifications.service";
import {TranslateService} from "@ngx-translate/core";
import {NotificationAnimationType, NotificationsService, Options} from "angular2-notifications";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private notificationEmitter: NotificationsEmitterService,
              private _notifications: NotificationsService,
              private translate: TranslateService) {
    translate.addLangs(['bg']);
    translate.setDefaultLang('bg');
    translate.use('bg');
  }

  title = 'electricity-meters';
  notificationOptions: Options = {
    position: ['bottom', 'right'],
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    lastOnBottom: true,
    maxLength: 0,
    animate: NotificationAnimationType.Scale,
  };

  ngOnInit() {
    this.subscribeForMessageNotifications();
  }

  subscribeForMessageNotifications() {
    this.notificationEmitter.Success.subscribe((msg) => {
      this.showNotification(msg, 'Success');
    });
    this.notificationEmitter.Error.subscribe((error: { key: any; message: any }) => {
      if (error.key && error.message) {
        if (this.hasTranslation(`${error.key}${error.message}`)) {
          this.showNotificationError(`${error.key}${error.message}`, 'Error');
        } else {
          this.translate.get('UnhandledKeyMessageError', { error: `${error.key}${error.message}` }).subscribe((msg) => {
            this.showNotificationError(msg, 'Error');
          });
        }
      } else {
        if (this.hasTranslation(`${error.toString()}`)) {
          this.showNotificationError(`${error.toString()}`, 'Error');
        } else {
          this.translate.get('UnhandledKeyMessageError', { error: `${error.toString()}` }).subscribe((msg) => {
            this.showNotificationError(msg, 'Error');
          });
        }
      }
    });
    this.notificationEmitter.Info.subscribe((msg) => {
      this.showNotification(msg, 'Info');
    });
  }

  hasTranslation(key: string): boolean {
    if (key.indexOf(' ') >= 0) return true;
    const translation = this.translate.instant(key);
    return translation !== key && translation !== '';
  }

  showNotification(message: string, type: string) {
    this.translate.get([message, type]).subscribe((data) => {
      // @ts-ignore
      this._notifications[type.toLowerCase()](data[type], data[message]);
    });
  }

  showNotificationError(message: string, type: string) {
    this.translate.get([message, type]).subscribe((data) => {
      this._notifications['error'](data[type], data[message]);
    });
  }
}
