import { Injectable } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class TableHelperService {
  constructor() {}

  isNoResultsOrNoRecords(firstInit: boolean, totalRecords: number): { noRecords: boolean; noResults: boolean } {
    let noResults = false;
    let noRecords = false;

    if (firstInit && totalRecords === 0) {
      noRecords = true;
    } else if (!firstInit && totalRecords === 0) {
      noResults = true;
    }

    return { noRecords, noResults };
  }

  getPagingSettings(settings: TableLazyLoadEvent): { page: number; pageSize: number } {
    return {
      page: (settings.first || 0) / (settings.rows || 10),
      pageSize: settings.rows || 10,
    };
  }

  getSortingSettings(settings: TableLazyLoadEvent): { sortProp: string; sortDirection: number } {
    return {
      sortProp: typeof settings.sortField === 'string' ? settings.sortField : '',
      sortDirection: settings.sortOrder !== null && settings.sortOrder !== undefined ? settings.sortOrder : 1,
    };
  }
}
