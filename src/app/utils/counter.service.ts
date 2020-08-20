import { Injectable, NgZone } from '@angular/core';
import { FieldService } from './field.service';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import local from '../local';
import { FightersectionComponent } from '../components/landing/battlefield/fighter-section/fightersection.component';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  constructor(
    private http: HttpClient,
    private fieldService: FieldService
  ) { }

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
        if (val.actioncount > this.count) {
          val.acting = '1'
        } else {
          val.acting = '0'
          if (val.topcheck = '1') {
            this.fieldService.sendBattleData({ hash: this.hash, type: 'fighterChange', value: '0', id: val.id, fighterProperty: 'topcheck' })
            val.topcheck = '0'
          }
        }
        newFighters.push({ ...val })
      }
    })

    this.fighters = newFighters
  }

  addFighter(fighters) {
    this.fighters = this.fighters.concat(fighters)
    let playerFighters = fighters.map(fighter => {
      let wound = fighter.health * 100 / fighter.max_health;
      if (wound === 0) {
        wound = 0
      } else if (wound > 0 && wound < 25) {
        wound = 1
      } else if (wound >= 25 && wound < 50) {
        wound = 25
      } else if (wound >= 50 && wound < 75) {
        wound = 50
      } else if (wound >= 75 && wound < 100) {
        wound = 75
      } else if (wound >= 100) {
        wound = 100
      }
      return {
        colorcode: fighter.colorcode,
        dead: fighter.dead,
        hidden: fighter.hidden,
        id: fighter.id,
        namefighter: fighter.namefighter,
        stress: fighter.stress * 100 / fighter.stressthreshold,
        topcheck: '0',
        weapon: fighter.selected.weapon,
        wound
      }
    })
    this.fieldService.sendBattleData({ hash: this.hash, type: 'addFighter', value: playerFighters })
    this.sort()
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
