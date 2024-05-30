import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class StorageService {
  public Token: EventEmitter<any> = new EventEmitter();
}
