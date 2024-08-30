import {Component, OnInit} from '@angular/core';
import {DefaultFee, UpdateFeesRequest} from "../../core/models/settings.model";
import {SettingsService} from "./settings.service";
import {ErrorService} from "../../core/services/error.service";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {PageHeadingComponent} from "../../core/ui/page-heading/page-heading.component";
import {TranslateModule} from "@ngx-translate/core";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    PageHeadingComponent,
    TranslateModule,
    FaIconComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  constructor(private settingsService: SettingsService,
              private errorService: ErrorService,
              private notifications: NotificationsEmitterService) { }

  feeList: DefaultFee[] = [];
  loadedFees: boolean = false;
  feesChanged: boolean = false;

  ngOnInit() {
    this.fetchAllDefaultFees();
  }

  fetchAllDefaultFees() {
    this.settingsService.getDefaultFees().subscribe((data) => {
      this.feeList = data;
      this.loadedFees = true;
    }, (error) => {
      this.errorService.processError(error);
    });
  }

  updateFees() {
    const body: UpdateFeesRequest = {
      standartFees: this.feeList.map((fee: DefaultFee) => {
        return {
          value: fee.value,
          description: fee.description,
        };
      })
    }

    this.settingsService.updateDefaultFees(body).subscribe(() => {
      this.notifications.Success.emit("SuccessfullyUpdatedDefaultFees");
      this.feesChanged = false;
    }, (error) => {
      this.errorService.processError(error);
    });
  }

  deleteFee(i: number) {
    this.feeList.splice(i, 1);
    this.feesChanged = true;
  }
}
