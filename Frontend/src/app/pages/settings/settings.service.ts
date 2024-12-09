import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateFeesRequest } from '../../core/models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient) {}

  // Get all default fees
  getDefaultFees(): Observable<any> {
    return this.http.get(environment.url + '/api/settings/default-fees');
  }
  // Update default fees
  updateDefaultFees(body: UpdateFeesRequest): Observable<any> {
    return this.http.post(environment.url + '/api/settings/default-fees', body);
  }
}
