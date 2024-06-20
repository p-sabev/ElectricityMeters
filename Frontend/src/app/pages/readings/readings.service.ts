import { Injectable } from '@angular/core';
import {
  EditReading,
  InsertMultipleReadings,
  InsertReading, Reading,
  SearchReadingsRequest
} from "../../core/models/readings.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllReadings(): Observable<Reading[]> {
    return this.http.get<Reading[]>(environment.url + '/api/readings');
  }

  // Get all readings by subscriber id
  getAllReadingsBySubscriberId(subscriberId: number): Observable<Reading[]> {
    return this.http.get<Reading[]>(environment.url + `/api/readings/by-subscriber/${subscriberId}`);
  }

  // Search
  searchReadings(body: SearchReadingsRequest): Observable<any> {
    return this.http.post(environment.url + '/api/readings/search', body);
  }

  // Add
  insertReading(body: InsertReading) {
    return this.http.post(environment.url + '/api/readings', body);
  }

  // Add multiple readings
  insertReadingsForSubscribers(body: InsertMultipleReadings) {
    return this.http.post(environment.url + '/api/readings/add-multiple-readings', body);
  }

  // Edit
  editReading(body: EditReading) {
    return this.http.put(environment.url + `/api/readings/${body.id}`, body);
  }

  // Delete
  deleteReading(id: number) {
    return this.http.delete(`/api/readings/${id}`);
  }
}
