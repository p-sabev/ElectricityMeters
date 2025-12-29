import { Subscriber } from './subscribers.model';
import { Paging, Sorting } from './base-models.model';

export interface Reading {
  id: number;
  subscriber: Subscriber;
  dateFrom: Date | string;
  dateTo: Date | string;
  value: number;
  firstPhaseValue: number;
  secondPhaseValue: number;
  thirdPhaseValue: number;
  amountDue: number;
  amountDueCopy?: number;
  difference: number;
  currentPrice: number;
  isPaid?: boolean;
  feeList?: PaymentFee[];
  usedReadingCoefficient?: number;
  usedFixedPrice?: number;
}

export interface PaymentFee {
  id: number;
  value: number;
  description: string;
  paymentId: number;
  dataGroup: number;
}

export interface InsertReading {
  subscriberId: number;
  dateFrom: Date | string;
  dateTo: Date | string;
  value: number;
  firstPhaseValue: number;
  secondPhaseValue: number;
  thirdPhaseValue: number;
}

export interface InsertMultipleReadings {
  subscribersReading: InsertReading[];
}

export interface EditReading {
  id: number;
  subscriberId: number;
  dateFrom: Date | string;
  dateTo: Date | string;
  value: number;
  firstPhaseValue: number;
  secondPhaseValue: number;
  thirdPhaseValue: number;
  currentPrice?: number;
}

export interface SearchReadingsRequest {
  paging: Paging;
  sorting: Sorting;
  name: string;
}

export interface PendingPaymentsReportResponse {
  pendingTotalElectricity: number;
  pendingTotalFees: number;
  standardFeesSum: number;
  subscribersPendindPayments: SubscibersPendingPayments[];
}

export interface SubscibersPendingPayments {
  subscriber: Subscriber;
  paymentsCount: number;
  totalAmountDue: number;
}
