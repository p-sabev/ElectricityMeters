import { Paging, Sorting } from './base-models.model';

export interface SearchUsersModel {
  paging: Paging;
  sorting: Sorting;
  name?: string;
  email?: string;
}

export interface EditUserModel {
  id: string;
  name: string;
  middleName: string;
  lastName: string;
  email: string;
  userName: string;
  roleIds: string[];
}

export interface SearchUsersResponse {
  data: User[];
  totalRecords: number;
}

export interface User {
  id: string;
  name: string;
  middleName: string;
  lastName: string;
  email: string;
  userName: string;
  roleIds: string[];
}

export interface Role {
  id: string;
  name: string;
}
