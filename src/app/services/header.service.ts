import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderValues } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  vals = new BehaviorSubject<HeaderValues>({
    title: '',
    iconEnd: '',
    iconStart: '',
    endRouterlink: [],
    startRouterlink: []
  });
  constructor() { }

  setHeader(vals: HeaderValues) {
    this.vals.next(vals);
  }
}
