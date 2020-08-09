import { Injectable } from '@angular/core';

class meta {
  id?: number
  name?: string
  count?: number
  hash?: string
}
@Injectable({
  providedIn: 'root'
})
export class CounterService {

  constructor() { }

  
  public fighters = [];
  public meta:meta = {};
  public timeId = null;

  public sort() {
    this.fighters.sort((a, b) => a.actioncount - b.actioncount);

    this.fighters.forEach(val => {
      if (val.actioncount > this.meta.count || val.hidden == 1) {
        val.acting = '1'
      } else {
        val.acting = '0'
        val.topcheck = '0'
      }
    })

    this.fighters = this.fighters
  }

  public incrementCount() {
    this.meta.count = ++this.meta.count
    this.sort()
  }

  public decrementCount() {
    if (this.meta.count > 1) {
      this.meta.count = --this.meta.count
      this.sort()
    }
  }

  public resetCount() {
    this.meta.count = 1
    this.sort()
  }

  public startAutoCountOne() {
    let incrementCount = this.incrementCount.bind(this)
    clearInterval(this.timeId)
    this.timeId = setInterval(incrementCount, 1000)
  }

  public startAutoCountTwo() {
    let incrementCount = this.incrementCount.bind(this)
    clearInterval(this.timeId)
    this.timeId = setInterval(incrementCount, 500)
  }

  public stopAutoCount() {
    clearInterval(this.timeId)
  }
}
