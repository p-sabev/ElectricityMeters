import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {EditUserModel, SearchUsersModel} from "../../core/models/users.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  // Search
  searchUsers(body: SearchUsersModel): Observable<any> {
    return this.http.post(environment.url + '/api/Account/search', body);
  }

  // Edit
  editUser(body: EditUserModel) {
    return this.http.put(environment.url + '/api/Account', body);
  }

  // Delete
  deleteUser(id: string) {
    return this.http.delete(environment.url + `/api/Account/${id}`);
  }

  getAllRoles() {
    return this.http.get(environment.url + '/api/Account/GetAllRoles');
  }
}
