import {InsertSubscriber, Subscriber} from "./subscribers.model";
import {Paging, Sorting} from "./base-models.model";

export interface Reading {
  id: number;
  subscriber: Subscriber;
  date: Date | string;
  value: number;
  amountDue: number;
  difference: number;
  currentPrice: number;
}

export interface InsertReading {
  subscriberId: number;
  date: Date | string;
  value: number;
}

export interface InsertMultipleReadings {
  subscribersReading: InsertReading[];
}

export interface EditReading {
  id: number;
  subscriberId: number;
  date: Date | string;
  value: number;
  currentPrice?: number;
}

export interface SearchReadingsRequest {
  paging: Paging;
  sorting: Sorting;
  name: string;
}
