import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ErrorService } from '../../../core/services/error.service';
import { ReadingsService } from '../readings.service';
import { PendingPaymentsReportResponse, SubscibersPendingPayments } from '../../../core/models/readings.model';
import { CalendarModule } from 'primeng/calendar';
import { NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TwoAfterDotPipe } from '../../../shared/pipes/two-after-dot/two-after-dot.pipe';
import { TableModule } from 'primeng/table';
import { catchError, EMPTY, tap } from 'rxjs';
import { NotificationsEmitterService } from '../../../core/services/notifications.service';
import { toBlob } from 'html-to-image';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pending-payments',
  standalone: true,
  imports: [CalendarModule, FaIconComponent, NgForOf, NgIf, TranslateModule, TwoAfterDotPipe, TableModule],
  templateUrl: './pending-payments.component.html',
  styleUrl: './pending-payments.component.scss',
})
export class PendingPaymentsComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readingsService: ReadingsService,
    private errorService: ErrorService,
    private notifications: NotificationsEmitterService
  ) {}

  @ViewChild('exportContainer') exportContainer?: ElementRef<HTMLElement>;

  pendingPaymentsReportData: PendingPaymentsReportResponse | null = null;
  hasSomeWithMoreThanOnePayment = false;
  isExportingPng = false;
  isExportingPdf = false;

  ngOnInit() {
    this.fetchAllPendingPaymentsReport();
  }

  fetchAllPendingPaymentsReport() {
    this.readingsService
      .fetchAllPendingPayments()
      .pipe(
        tap((resp: any) => {
          this.pendingPaymentsReportData = resp;
          if (resp?.subscribersPendindPayments?.length) {
            resp.subscribersPendindPayments.forEach((subscriber: SubscibersPendingPayments) => {
              if (subscriber.paymentsCount > 1) {
                this.hasSomeWithMoreThanOnePayment = true;
              }
            });
          }
        }),
        catchError((error: any) => {
          this.errorService.processError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  formatNameForExport(fullName: string): string {
    const normalized = (fullName ?? '').trim().replace(/\s+/g, ' ');
    const parts = normalized.split(' ').filter(Boolean);
    if (parts.length < 2) return normalized;

    const firstInitial = parts[0].slice(0, 1).toUpperCase();
    const rest = parts.slice(1).join(' ');
    return `${firstInitial}. ${rest}`;
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private async createExportImageBlob(): Promise<Blob | null> {
    if (!this.exportContainer?.nativeElement) return null;

    const originalNode = this.exportContainer.nativeElement;
    const clone = originalNode.cloneNode(true) as HTMLElement;

    clone.style.position = 'fixed';
    clone.style.left = '0';
    clone.style.top = '0';
    clone.style.zIndex = '-1';
    clone.style.opacity = '1';
    clone.style.pointerEvents = 'none';
    clone.style.transform = 'none';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';

    document.body.appendChild(clone);
    try {
      return await toBlob(clone, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });
    } finally {
      document.body.removeChild(clone);
    }
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async exportAsPng() {
    if (this.isExportingPng || this.isExportingPdf) return;
    if (!this.pendingPaymentsReportData?.subscribersPendindPayments?.length) return;
    if (!this.exportContainer?.nativeElement) return;

    this.isExportingPng = true;
    try {
      const blob = await this.createExportImageBlob();

      if (!blob) return;

      const filename = `pending-payments_${new Date().toISOString().slice(0, 10)}.png`;
      this.downloadBlob(blob, filename);

      try {
        if ('clipboard' in navigator && 'ClipboardItem' in window) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          this.notifications.Success.emit('CopiedToClipboard');
        } else {
          this.notifications.Info.emit('ClipboardNotAvailable');
        }
      } catch {
        this.notifications.Info.emit('ClipboardNotAvailable');
      }
    } catch (e: any) {
      this.notifications.ErrorNoTranslate.emit('ExportFailed');
      console.error(e);
    } finally {
      this.isExportingPng = false;
    }
  }

  async exportAsPdf() {
    if (this.isExportingPdf || this.isExportingPng) return;
    if (!this.pendingPaymentsReportData?.subscribersPendindPayments?.length) return;

    this.isExportingPdf = true;
    try {
      const blob = await this.createExportImageBlob();
      if (!blob) return;

      const imageDataUrl = await this.blobToDataUrl(blob);
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Unable to load export image'));
        image.src = imageDataUrl;
      });

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      const imageHeightScaled = (image.height * contentWidth) / image.width;
      const usableHeight = pageHeight - margin * 2;

      let yOffset = 0;
      doc.addImage(imageDataUrl, 'PNG', margin, margin, contentWidth, imageHeightScaled, undefined, 'FAST');

      while (yOffset + usableHeight < imageHeightScaled) {
        yOffset += usableHeight;
        doc.addPage();
        doc.addImage(imageDataUrl, 'PNG', margin, margin - yOffset, contentWidth, imageHeightScaled, undefined, 'FAST');
      }

      const filename = `pending-payments_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
    } catch (e: any) {
      this.notifications.ErrorNoTranslate.emit('ExportFailed');
      console.error(e);
    } finally {
      this.isExportingPdf = false;
    }
  }
}
