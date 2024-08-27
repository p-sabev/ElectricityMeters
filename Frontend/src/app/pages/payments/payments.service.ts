import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {InsertPayment, SearchPaymentsListRequest} from "../../core/models/payment.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllPayments(): Observable<any> {
    return this.http.get(environment.url + '/api/payments');
  }

  // Search
  searchPayments(body: SearchPaymentsListRequest): Observable<any> {
    return this.http.post(environment.url + '/api/payments/search', body);
  }

  // Add
  insertPayment(body: InsertPayment) {
    return this.http.post(environment.url + '/api/payments', body);
  }

  // Delete
  deletePayment(id: number) {
    return this.http.delete(environment.url + `/api/payments/${id}`);
  }
}
