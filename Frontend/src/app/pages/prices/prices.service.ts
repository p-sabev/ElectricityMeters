import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EditPrice, InsertPrice, SearchPrices} from "../../core/models/prices.model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllPrices(): Observable<any> {
    return this.http.get(environment.url + '/api/prices');
  }

  // Get all
  searchPrices(body: SearchPrices): Observable<any> {
    return this.http.post(environment.url + '/api/prices/search', body);
  }

  // Add
  insertPrice(body: InsertPrice) {
    return this.http.post(environment.url + '/api/prices', body);
  }

  // Edit
  editPrice(body: EditPrice) {
    return this.http.put(environment.url + '/api/prices', body);
  }

  // Delete
  deletePrice(id: number) {
    return this.http.delete(environment.url + `/api/prices/${id}`);
  }
}
