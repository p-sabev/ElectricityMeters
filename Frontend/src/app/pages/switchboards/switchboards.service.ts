import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EditSwitchboard, Switchboard, InsertSwitchboard} from "../../core/models/switchboards.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SwitchboardsService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllSwitchboards(): Observable<any> {
    return this.http.get('/api/switchboards');
  }

  // Add
  insertSwitchboard(body: InsertSwitchboard) {
    return this.http.post('/api/switchboards', body);
  }

  // Edit
  editSwitchboard(body: EditSwitchboard) {
    return this.http.put('/api/switchboards', body);
  }

  // Delete
  deleteSwitchboard(id: number) {
    return this.http.delete(`/api/switchboards/${id}`);
  }
}
