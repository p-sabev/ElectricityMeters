import {Switchboard} from "./switchboards.model";

export interface Subscriber {
  id: number;
  numberPage: number;
  name: string;
  switchboard: Switchboard;
  address?: string;
  phone?: string;
  meterNumber?: string;
  lastRecordDate?: null | string | Date;
  lastReading?: number;
  note?: string;
}

export interface InsertSubscriber {
  numberPage: number;
  name: string;
  switchboardId: number;
  address?: string;
  phone?: string;
  meterNumber?: string;
  note?: string;
}

export interface EditSubscriber {
  id: number;
  numberPage: number;
  name: string;
  switchboardId: number;
  address?: string;
  phone?: string;
  meterNumber?: string;
  note?: string;
}

export interface SubscriberAddEdit {
  id?: number | null;
  numberPage: number;
  name: string;
  switchboardId: number;
  address?: string;
  phone?: string;
  meterNumber?: string;
  note?: string;
}
