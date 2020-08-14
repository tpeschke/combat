import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

    let newFighters = []
    this.fighters.map(val => {
      if (val.actioncount) {
        if (val.actioncount > this.count || val.hidden == 1) {
          val.acting = '1'
        } else {
          val.acting = '0'
          val.topcheck = '0'
        }
        newFighters.push({...val}) 
      }
    })

    this.fighters = newFighters
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
