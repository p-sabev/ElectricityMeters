import {Reading} from "./readings.model";
import {Paging, Sorting} from "./base-models.model";

export interface Fee {
  id?: number,
  value: number | null,
  description: string
}

export interface Payment {
  id: number,
  reading: Reading,
  date: Date,
  feeList: Fee[]
}

export interface InsertPayment {
  readingId: number,
  date: Date,
  feeList: Fee[]
}

export interface SearchPaymentsListRequest {
  paging: Paging,
  sorting: Sorting,
  name: string
}

export interface SearchPaymentsListResponse {
  data: SearchPaymentsListResponseData[],
  totalRecords: number
}

export interface SearchPaymentsListResponseData {
  id: number,
  reading: Reading,
  date: Date,
  feeList: Fee[]
}
