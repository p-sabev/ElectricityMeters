export interface Paging {
  page: number;
  pageSize: number;
}

export interface Sorting {
  sortProp: string;
  sortDirection: number;
}

export interface TableSearchSettings {
  first: number;
  rows: number;
  sortField: string;
  sortOrder: number;
}
