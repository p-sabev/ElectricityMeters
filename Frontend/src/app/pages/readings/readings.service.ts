import { Injectable } from '@angular/core';
import {EditReading, InsertReading} from "../../core/models/readings.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllReadings() {
    return this.http.get('/api/readings');
  }

  // Add
  insertReading(body: InsertReading) {
    return this.http.post('/api/readings', body);
  }

  // Edit
  editReading(body: EditReading) {
    return this.http.put('/api/readings', body);
  }

  // Delete
  deleteReading(id: number) {
    return this.http.delete(`/api/readings/${id}`);
  }
}
