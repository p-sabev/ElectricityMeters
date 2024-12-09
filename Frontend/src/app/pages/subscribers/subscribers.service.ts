import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EditSubscriber, InsertSubscriber, SearchSubscribersRequest } from '../../core/models/subscribers.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  constructor(private http: HttpClient) {}

  // Get all
  getAllSubscribers(): Observable<any> {
    return this.http.get(environment.url + '/api/subscribers');
  }

  // Search
  searchSubscribers(body: SearchSubscribersRequest): Observable<any> {
    return this.http.post(environment.url + '/api/subscribers/search', body);
  }

  // Add
  insertSubscriber(body: InsertSubscriber) {
    return this.http.post(environment.url + '/api/subscribers', body);
  }

  // Edit
  editSubscriber(body: EditSubscriber) {
    return this.http.put(environment.url + '/api/subscribers', body);
  }

  // Delete
  deleteSubscriber(id: number) {
    return this.http.delete(environment.url + `/api/subscribers/${id}`);
  }
}
