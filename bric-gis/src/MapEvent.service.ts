import {Injectable}      from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { BricMapEvent } from './models/BricMapEvent';

@Injectable() 
export class MapEventService {
  events: BehaviorSubject<any>;
    
  constructor() {
    this.events = <BehaviorSubject<BricMapEvent>>new BehaviorSubject(null);
  }
    
  emitEvent(event: BricMapEvent) {
    this.events.next(event);
  }
}
