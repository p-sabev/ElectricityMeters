import { Paging, Sorting } from './base-models.model';
import { Subscriber } from './subscribers.model';

export interface Switchboard {
  id: number;
  name: string;
  subscribers?: Subscriber[];
}

export interface InsertSwitchboard {
  name: string;
}

export interface EditSwitchboard {
  id: number;
  name: string;
}

export interface SearchSwitchboardsRequest {
  paging: Paging;
  sorting: Sorting;
  name: string;
}
