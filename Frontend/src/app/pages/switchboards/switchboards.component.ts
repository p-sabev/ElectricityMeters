import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Switchboard} from "../../core/models/switchboards.model";
import {SwitchboardsService} from "./switchboards.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ErrorService} from "../../core/services/error.service";
import {ConfirmationService} from "primeng/api";
import {NotificationsEmitterService} from "../../core/services/notifications.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AddEditSubscribersComponent} from "../subscribers/add-edit-subscribers/add-edit-subscribers.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AddEditSwitchboardComponent} from "./add-edit-switchboard/add-edit-switchboard.component";
import {Subscriber} from "../../core/models/subscribers.model";
import {
  AddReadingForSwitchboardComponent
} from "../readings/add-reading-for-switchboard/add-reading-for-switchboard.component";
import {PageHeadingComponent} from "../../core/ui/page-heading/page-heading.component";
import {RoleAccessDirective} from "../../shared/directives/role-access.directive";
import {TooltipModule} from "primeng/tooltip";
import {
  DisplayTwoThreePhaseReadingComponent
} from "../readings/display-two-three-phase-reading/display-two-three-phase-reading.component";

@Component({
  selector: 'app-switchboards',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, FaIconComponent, AddEditSubscribersComponent, ConfirmDialogModule, AddEditSwitchboardComponent, AddReadingForSwitchboardComponent, PageHeadingComponent, RoleAccessDirective, TooltipModule, DisplayTwoThreePhaseReadingComponent],
  providers: [ConfirmationService],
  templateUrl: './switchboards.component.html',
  styleUrl: './switchboards.component.scss'
})
export class SwitchboardsComponent implements OnInit {

  constructor(private switchboardsService: SwitchboardsService,
              private translate: TranslateService,
              private errorService: ErrorService,
              private confirmService: ConfirmationService,
              private notifications: NotificationsEmitterService) {
  }

  switchboardsList: Switchboard[] = [];

  sortField = 'name';
  sortOrder = 1;
  totalRecords = 0;

  addSwitchboard: boolean = false;
  switchboardForEdit: Switchboard | null = null;
  subscribersToAddReadings: Subscriber[] | null | undefined = null;

  firstInit: boolean = true;
  noRecords: boolean = false;
  noResults: boolean = false;

  ngOnInit() {
    this.fetchSwitchboardsList();
  }

  fetchSwitchboardsList() {
    const body = {
      paging: {
        page: 0,
        pageSize: 2147483647
      },
      sorting: {
        sortProp: this.sortField,
        sortDirection: this.sortOrder
      },
      name: ''
    }
    this.switchboardsService.searchSwitchboards(body).subscribe(resp => {
      if (resp?.data?.length) {
        this.switchboardsList = this.sortByNumericName(resp.data);
      } else {
        this.switchboardsList = [];
      }
      this.totalRecords = resp?.totalRecords || 0;

      if (this.firstInit && this.totalRecords === 0) {
        this.noRecords = true;
      } else if (!this.firstInit && this.totalRecords === 0) {
        this.noResults = true;
      } else {
        this.noRecords = false;
        this.noResults = false;
      }
    }, (error: any) => {
      this.errorService.processError(error);
    }, () => {
      this.firstInit = false;
    });
  }

  initAddSwitchboard() {
    this.addSwitchboard = true;
  }

  openSwitchboardForEdit(switchboard: Switchboard) {
    this.switchboardForEdit = switchboard;
  }

  askToDeleteSwitchboard(switchboard: Switchboard) {
    const message = 'AreYouSureToDeleteThisSwitchboard';
    const header = 'AreYouSure';
    this.translate.get([message, header]).subscribe((data) => {
      this.confirmService.confirm({
        message: `${data[message]} - ${switchboard.name}?`,
        icon: 'fa fa-question-circle-o',
        header: data[header],
        accept: () => {
          this.deleteSwitchboard(switchboard);
        },
      });
    });
  }

  deleteSwitchboard(switchboard: Switchboard) {
    this.switchboardsService.deleteSwitchboard(switchboard.id).subscribe(() => {
      this.notifications.Success.emit("SuccessfullyDeletedSwitchboard");
      this.fetchSwitchboardsList();
    }, error => {
      this.errorService.processError(error);
    });
  }

  sortByNumericName(arr: Switchboard[]): Switchboard[] {
    const numericItems = arr.filter(item => !isNaN(Number(item.name)));
    const textItems = arr.filter(item => isNaN(Number(item.name)));

    numericItems.sort((a, b) => Number(a.name) - Number(b.name));

    return [...numericItems, ...textItems];
  }

}
