import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsEmitterService {
  public Success: EventEmitter<any> = new EventEmitter();
  public Error: EventEmitter<any> = new EventEmitter();
  public ErrorNoTranslate: EventEmitter<any> = new EventEmitter();
  public Info: EventEmitter<any> = new EventEmitter();
  public Storage: EventEmitter<any> = new EventEmitter();
  public InfoDebounce: EventEmitter<any> = new EventEmitter();
}
