import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  EditSwitchboard,
  InsertSwitchboard,
  SearchSwitchboardsRequest
} from "../../core/models/switchboards.model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SwitchboardsService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllSwitchboards(): Observable<any> {
    return this.http.get(environment.url + '/api/switchboards');
  }

  // Search
  searchSwitchboards(body: SearchSwitchboardsRequest): Observable<any> {
    return this.http.post(environment.url + '/api/switchboards/search', body);
  }

  // Add
  insertSwitchboard(body: InsertSwitchboard) {
    return this.http.post(environment.url + '/api/switchboards', body);
  }

  // Edit
  editSwitchboard(body: EditSwitchboard) {
    return this.http.put(environment.url + '/api/switchboards', body);
  }

  // Delete
  deleteSwitchboard(id: number) {
    return this.http.delete(environment.url + `/api/switchboards/${id}`);
  }
}
