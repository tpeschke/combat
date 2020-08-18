import { Component, OnInit, Input } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';
import { MatDialog } from '@angular/material';
import { FieldService } from 'src/app/utils/field.service';
import { WeaponSelectComponent } from '../../../utils/weapon-select/weapon-select.component';

@Component({
  selector: 'app-singlefighter',
  templateUrl: './singlefighter.component.html',
  styleUrls: ['./../../fightersection.component.css']
})
export class SinglefighterComponent implements OnInit {
  @Input() fighter: any;

  constructor(
    public counterService: CounterService,
    private dialog: MatDialog,
    public fieldService: FieldService
  ) { }

  ngOnInit() {
    this.calculateWoundCategory();
  }

  calculateWoundCategory() {
    let wound = this.fighter.health * 100 / this.fighter.max_health;
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
    this.fighter.woundCategory = wound
  }

  openWeaponSelect(id, weapons) {
    this.dialog.open(WeaponSelectComponent, {
      panelClass: 'dialogStyling',
      data: {
        id,
        weapons
      }
    });
  }

  toggleHidden(isOnOrOff, id) {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === id) {
        if (isOnOrOff === '1') {
          fighters[i].hidden = '0'
          this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: '0', id, fighterProperty: 'hidden' })
        } else {
          fighters[i].hidden = '1'
          this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: '1', id, fighterProperty: 'hidden' })
        }
        this.counterService.sort()
        i = fighters.length
      }
    }
  }

  changeDamage(event, fighterId) {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === fighterId) {
        fighters[i].health = +event.target.value
        this.calculateWoundCategory()
        let wound = this.fighter.woundCategory === 0 ? '00' : this.fighter.woundCategory;
        if (wound === 1) {
          wound = 10
        } else if (wound === 100) {
          wound = ''
        }
        this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: wound, id: fighterId, fighterProperty: 'wound' })
        i = fighters.length
      }
    }
  }

  changeStress(event, fighterId) {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === fighterId) {
        fighters[i].stress = +event.target.value
        // this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: wound, id: fighterId, fighterProperty: 'wound' })
        i = fighters.length
      }
    }
  }

  increaseAction() {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        if (!this.fighter.actioncount.length) {
          if (fighters[i].actioncount < this.counterService.count) {
            fighters[i].actioncount = this.fighter.selected.speed + this.counterService.count
          } else {
            fighters[i].actioncount = this.fighter.selected.speed + this.fighter.actioncount
          }
          this.counterService.sort()
        }
        i = fighters.length
      }
    }
  }

  jumpToCount() {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        if (!this.fighter.actioncount.length) {
          fighters[i].actioncount = this.counterService.count
          this.counterService.sort()
        }
        i = fighters.length
      }
    }
  }
}
