import { Paging, Sorting } from './base-models.model';

export interface Price {
  id: number;
  priceInLv: number;
  dateFrom: Date | string;
  dateTo: null | Date | string;
  note: string;
  isUsed?: boolean;
}

export interface InsertPrice {
  id?: number | null;
  priceInLv: number;
  dateFrom: Date | string;
  note: string;
}

export interface EditPrice {
  id: number;
  priceInLv: number;
  dateFrom: Date | string;
  note: string;
}

export interface SearchPrices {
  paging: Paging;
  sorting: Sorting;
}
