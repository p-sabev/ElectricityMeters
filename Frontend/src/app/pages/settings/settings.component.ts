import { Component, OnInit } from '@angular/core';
import { DefaultFee, UpdateFeesRequest } from '../../core/models/settings.model';
import { SettingsService } from './settings.service';
import { ErrorService } from '../../core/services/error.service';
import { NotificationsEmitterService } from '../../core/services/notifications.service';
import { PageHeadingComponent } from '../../core/ui/page-heading/page-heading.component';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [PageHeadingComponent, TranslateModule, FaIconComponent, NgForOf, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private errorService: ErrorService,
    private notifications: NotificationsEmitterService
  ) {}

  feeList: DefaultFee[] = [];
  loadedFees: boolean = false;
  feesChanged: boolean = false;

  noFeesAdded: boolean = false;

  ngOnInit() {
    this.fetchAllDefaultFees();
  }

  fetchAllDefaultFees() {
    this.settingsService
      .getDefaultFees()
      .pipe(
        tap((data) => {
          this.feeList = data;
          this.loadedFees = true;
          this.feesChanged = false;
          this.noFeesAdded = !data?.length;
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updateFees() {
    const body: UpdateFeesRequest = {
      standartFees: this.feeList.map((fee: DefaultFee) => {
        return {
          value: fee.value,
          description: fee.description,
        };
      }),
    };

    this.settingsService
      .updateDefaultFees(body)
      .pipe(
        tap(() => {
          this.notifications.Success.emit('SuccessfullyUpdatedDefaultFees');
          this.feesChanged = false;
        }),
        catchError((error) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  deleteFee(i: number) {
    this.feeList.splice(i, 1);
    this.feesChanged = true;
    if (!this.feeList?.length) {
      this.noFeesAdded = true;
    }
  }
}
