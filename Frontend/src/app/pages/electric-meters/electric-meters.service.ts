import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EditElectricMeter, ElectricMeter, InsertElectricMeter} from "../../core/models/electric-meters.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ElectricMetersService {

  constructor(private http: HttpClient) { }

  // Get all
  getAllElectricMeters(): Observable<any> {
    return this.http.get('/api/electric-meters');
  }

  // Add
  insertElectricMeter(body: InsertElectricMeter) {
    return this.http.post('/api/electric-meters', body);
  }

  // Edit
  editElectricMeter(body: EditElectricMeter) {
    return this.http.put('/api/electric-meters', body);
  }

  // Delete
  deleteElectricMeter(id: number) {
    return this.http.delete(`/api/electric-meters/${id}`);
  }
}
