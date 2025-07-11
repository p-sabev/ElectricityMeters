import { Component, OnInit } from '@angular/core';
import { NotificationsEmitterService } from './core/services/notifications.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  NotificationAnimationType,
  NotificationsService,
  Options,
  SimpleNotificationsModule,
} from 'angular2-notifications';
import { PrimeNGConfig } from 'primeng/api';
import { LoaderComponent } from './core/ui/loader/loader.component';
import { HeaderComponent } from './core/ui/header/header.component';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    LoaderComponent,
    HeaderComponent,
    RouterOutlet,
    SimpleNotificationsModule,
    ConfirmDialogModule,
    TranslateModule,
  ],
})
export class AppComponent implements OnInit {
  constructor(
    private notificationEmitter: NotificationsEmitterService,
    private _notifications: NotificationsService,
    private translate: TranslateService,
    private primeNgConfig: PrimeNGConfig
  ) {
    this.setTranslateProps();
  }

  title = 'electricity-meters';
  notificationOptions: Options = {
    position: ['bottom', 'right'],
    timeOut: 5000,
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

  setTranslateProps() {
    this.translate.addLangs(['bg']);
    this.translate.setDefaultLang('bg');
    this.translate.use('bg');
    this.translate.get('primeng').subscribe((res) => this.primeNgConfig.setTranslation(res));
  }

  subscribeForMessageNotifications() {
    this.notificationEmitter.Success.subscribe((msg) => {
      this.showNotification(msg, 'Success');
    });
    this.notificationEmitter.Error.subscribe((error: { key: string; message: string }) => {
      this.handleErrorNotification(error);
    });
    this.notificationEmitter.ErrorNoTranslate.subscribe((msg: string) => {
      this.showNotificationError(msg, 'Error');
    });
    this.notificationEmitter.Info.subscribe((msg) => {
      this.showNotification(msg, 'Info');
    });
  }

  handleErrorNotification(error: { key: string; message: string }) {
    if (error.key && error.message) {
      this.tryToTranslateAndShowErrorMessage(`${error.key}${error.message}`);
    } else {
      this.tryToTranslateAndShowErrorMessage(`${error.toString()}`);
    }
  }

  tryToTranslateAndShowErrorMessage(errorText: string) {
    if (this.hasTranslation(errorText)) {
      this.showNotificationError(errorText, 'Error');
    } else {
      this.translate.get('UnhandledKeyMessageError', { error: errorText }).subscribe((msg) => {
        this.showNotificationError(msg, 'Error');
      });
    }
  }

  hasTranslation(key: string): boolean {
    if (key.indexOf(' ') >= 0) return true;
    const translation = this.translate.instant(key);
    return translation !== key && translation !== '';
  }

  showNotification(message: string, type: string) {
    this.translate.get([message, type]).subscribe((data) => {
      // @ts-expect-error - NotificationsService has no types
      this._notifications[type.toLowerCase()](data[type], data[message]);
    });
  }

  showNotificationError(message: string, type: string) {
    this.translate.get([message, type]).subscribe((data) => {
      this._notifications['error'](data[type], data[message]);
    });
  }
}
