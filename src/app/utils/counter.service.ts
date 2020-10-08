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
  public statuses = []

  public id = null;
  public name = null;
  public count = null;
  public hash = null;

  public timeId = null;

  public isSaving = false;
  public autoSaveTimer = null;

  public saveField = this.saveFieldUnbound.bind(this);

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

  saveFieldUnbound(encounter) {
    this.isSaving = true;
    let { name, count, hash, id, fighters, statuses } = this
    let field = {
      meta: {
        name, count, hash, id, encounter
      },
      fighters, statuses
    }
    this.fieldService.saveField(field).subscribe(result => this.isSaving = false)
  }

  startAutoSaveTimer() {
    clearInterval(this.autoSaveTimer)
    this.autoSaveTimer = setInterval(this.saveField, 300000)
  }

  stopAutoSaveTimer() {
    clearInterval(this.autoSaveTimer)
  }

  formatFightersForPlayers(fighters) {
    let playerFighters = fighters.map(fighter => {
      let wound: any = fighter.health * 100 / fighter.max_health
        , stressFromEncumb = 0
        , { encumb } = fighter.selected
        , multiplier = 0;
      if (wound === 0) {
        wound = '00'
        multiplier = 1
      } else if (wound > 0 && wound < 25) {
        wound = 10
        multiplier = 2
      } else if (wound >= 25 && wound < 50) {
        wound = 25
        multiplier = 3
      } else if (wound >= 50 && wound < 75) {
        wound = 50
        multiplier = 4
      } else if (wound >= 75 && wound < 100) {
        wound = 75
        multiplier = 5
      } else if (wound >= 100) {
        wound = ''
        multiplier = 6
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
        panicked: multiplier >= fighter.panic,
        broken: fighter.stress + stressFromEncumb >= fighter.stressthreshold && fighter.stressthreshold > 0,
        wound
      }
    })
    return playerFighters
  }

  addFighter(fighters) {
    this.fighters = this.fighters.concat(fighters)
    this.fieldService.sendBattleData({ hash: this.hash, type: 'addFighter', value: this.formatFightersForPlayers(fighters) })
    this.sort()
  }

  public incrementCount() {
    this.count = ++this.count
    if (this.count % 5 === 0) {this.saveField()}
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
