import { Switchboard } from './switchboards.model';
import { Paging, Sorting } from './base-models.model';

export interface Subscriber {
  id: number;
  numberPage: number;
  name: string;
  switchboard: Switchboard;
  address?: string;
  phone?: string;
  meterNumber?: string;
  lastRecordDate?: null | Date;
  lastReading?: number;
  note?: string;
  defaultReading?: number;
  phaseCount: number;
  lastFirstPhaseValue?: number;
  lastSecondPhaseValue?: number;
  lastThirdPhaseValue?: number;
}

export interface InsertSubscriber {
  numberPage: number;
  name: string;
  switchboardId: number;
  address?: string;
  phone?: string;
  meterNumber?: string;
  note?: string;
  defaultReading?: number;
  phaseCount: number;
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
  defaultReading?: number;
  phaseCount: number;
}

export interface SearchSubscribersRequest {
  paging: Paging;
  sorting: Sorting;
  numberPage: number | null;
  name: string | null;
  switchboardId: number | null;
  electricMeterName: string | null;
}
