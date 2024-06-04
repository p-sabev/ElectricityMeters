import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EditPrice, InsertPrice} from "../../core/models/prices.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllPrices(): Observable<any> {
    return this.http.get('/api/prices');
  }

  // Add
  insertPrice(body: InsertPrice) {
    return this.http.post('/api/prices', body);
  }

  // Edit
  editPrice(body: EditPrice) {
    return this.http.put('/api/prices', body);
  }

  // Delete
  deletePrice(id: number) {
    return this.http.delete(`/api/prices/${id}`);
  }
}
