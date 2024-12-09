import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public Token: EventEmitter<any> = new EventEmitter();
}
