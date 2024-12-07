import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { LoaderState } from './loader';
import { AuthService } from '../../services/auth.service';
import {NgClass, NgIf} from "@angular/common";
@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  imports: [
    NgClass,
    NgIf
  ],
  providers: [AuthService]
})
export class LoaderComponent implements OnInit, OnDestroy, AfterViewChecked {
  show = false;
  private subscription: Subscription | undefined;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe((state: LoaderState) => {
      this.show = state.show;
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
