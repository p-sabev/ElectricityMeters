import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { LogInCredentials } from "../authentication/login/login.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: LogInCredentials): Observable<any> {
    return this.http.post(`/api/api/v1/auth/authenticate`, credentials);
  }

}
