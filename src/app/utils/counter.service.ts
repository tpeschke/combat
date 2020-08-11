import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  constructor() { }

  public fighters = [];

  public id = null;
  public name = null;
  public count = null;
  public hash = null;

  public timeId = null;

  public sort() {
    this.fighters.sort((a, b) => a.actioncount - b.actioncount);

    this.fighters.forEach(val => {
      if (val.actioncount > this.count || val.hidden == 1) {
        val.acting = '1'
      } else {
        val.acting = '0'
        val.topcheck = '0'
      }
    })

    this.fighters = this.fighters
  }

  public incrementCount() {
    this.count = ++this.count
    this.sort()
  }

  public decrementCount() {
    if (this.count > 1) {
      this.count = --this.count
      this.sort()
    }
  }

  public resetCount() {
    this.count = 1
    this.sort()
  }
}
