import { Injectable, NgZone } from '@angular/core';
import { FieldService } from './field.service';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import local from '../local';
import { FightersectionComponent } from '../components/landing/battlefield/fighter-section/fightersection.component';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  constructor(
    private http: HttpClient,
    private fieldService: FieldService,
    private generalService: GeneralService
  ) { }

  public fighters = [];
  public statuses = []

  public id = null;
  public name = null;
  public count = null;
  public hash = null;
  public encounter = null;

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
          if (val.topcheck === '1') {
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
        name, count, hash, id, encounter: null
      },
      fighters, statuses
    }
    if (encounter && this.encounter) {
      field.meta.encounter = this.encounter
    } else if (encounter) {
      field.meta.encounter = this.generalService.makeid();
    }
    this.fieldService.saveField(field).subscribe(result => {
      this.encounter =
        this.isSaving = false
    })
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
        , stressCode = 0
        , fatigue = 'A';
      if (wound === 0) {
        wound = '00'
        fatigue = 'A'
      } else if (wound > 0 && wound < 25) {
        wound = 10
        fatigue = 'H'
      } else if (wound >= 25 && wound < 50) {
        wound = 25
        fatigue = 'B'
      } else if (wound >= 50 && wound < 75) {
        wound = 50
        fatigue = 'W'
      } else if (wound >= 75 && wound < 100) {
        wound = 75
        fatigue = 'C'
      } else if (wound >= 100) {
        wound = ''
        fatigue = 'N'
      }
      let stress: any = fighter.stress * 100 / fighter.stressthreshold
      if (fighter.stressthreshold !== 0) {
        if (stress === 0) {
          stress = '00'
          stressCode = 1
        } else if (stress > 0 && stress < 25) {
          stress = 10
          stressCode = 2
        } else if (stress >= 25 && stress < 50) {
          stress = 25
          stressCode = 3
        } else if (stress >= 50 && stress < 75) {
          stress = 50
          stressCode = 4
        } else if (stress >= 75 && stress < 100) {
          stress = 75
          stressCode = 5
        } else if (stress >= 100) {
          stress = ''
          stressCode = 7
        }
      } else {
        stress = '00'
      }

      let fatigued
      if (fatigue === 'A') {
        fatigued = fighter.selected.fatigue === 'A'
      } else if (fatigue === 'H') {
        fatigued = fighter.selected.fatigue === 'H' || fighter.selected.fatigue === 'A'
      } else if (fatigue === 'B') {
        fatigued = fighter.selected.fatigue === 'H' || fighter.selected.fatigue === 'A' || fighter.selected.fatigue === 'B'
      } else if (fatigue === 'W') {
        fatigued = fighter.selected.fatigue === 'H' || fighter.selected.fatigue === 'A' || fighter.selected.fatigue === 'B' || fighter.selected.fatigue === 'W'
      } else if (fatigue === 'C') {
        fatigued = fighter.selected.fatigue === 'H' || fighter.selected.fatigue === 'A' || fighter.selected.fatigue === 'B' || fighter.selected.fatigue === 'W' || fighter.selected.fatigue === 'C'
      } else {
        fatigued = false
      }

      return {
        colorcode: fighter.colorcode,
        dead: fighter.dead,
        hidden: fighter.hidden,
        id: fighter.id,
        namefighter: fighter.namefighter,
        stress,
        topcheck: '0',
        weapon: fighter.selected.weapon,
        cautious: fighter.health + fighter.stress > fighter.caution && fighter.caution > 0,
        panicked: stressCode >= fighter.panic,
        fatigued,
        broken: fighter.stress >= fighter.stressthreshold && fighter.stressthreshold > 0,
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

  removeFighter(fighters, i, id) {
    this.fieldService.sendBattleData({ hash: this.hash, type: 'removeFighter', value: id })
    this.fieldService.deleteFighter(id).subscribe(result => {
      fighters.splice(i, 1)
      this.fighters = fighters
      this.sort()
    })
  }

  public incrementCount() {
    this.count = ++this.count
    if (this.count % 5 === 0) { this.saveField() }
    this.fieldService.sendBattleData({ hash: this.hash, type: 'count', value: this.count })
    this.sort()
  }

  public decrementCount() {
    if (this.count > 1) {
      this.count = --this.count
      this.fieldService.sendBattleData({ hash: this.hash, type: 'count', value: this.count })
      this.sort()
    }
  }

  public resetCount() {
    this.count = 1
    this.fieldService.sendBattleData({ hash: this.hash, type: 'count', value: this.count })
    this.sort()
  }
}
