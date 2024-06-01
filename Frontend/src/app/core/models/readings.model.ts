import {Subscriber} from "./subscribers.model";

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

export interface EditReading {
  id: number;
  subscriberId: number;
  date: Date | string;
  value: number;
  currentPrice?: number;
}
