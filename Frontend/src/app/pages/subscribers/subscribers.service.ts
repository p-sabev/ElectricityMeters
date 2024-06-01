import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EditSubscriber, InsertSubscriber} from "../../core/models/subscribers.model";

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllSubscribers() {
    return this.http.get('/api/subscribers');
  }

  // Add
  insertSubscriber(body: InsertSubscriber) {
    return this.http.post('/api/subscribers', body);
  }

  // Edit
  editSubscriber(body: EditSubscriber) {
    return this.http.put('/api/subscribers', body);
  }

  // Delete
  deleteSubscriber(id: number) {
    return this.http.delete(`/api/subscribers/${id}`);
  }
}
