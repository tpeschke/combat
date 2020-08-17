import { Component, OnInit, Input } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';
import { FieldService } from 'src/app/utils/field.service';
import { MatDialog } from '@angular/material';
import { WeaponSelectComponent } from '../utils/weapon-select/weapon-select.component';
import { SwitchView } from '@angular/common/src/directives/ng_switch';

@Component({
  selector: 'app-fighter-section',
  templateUrl: './fightersection.component.html',
  styleUrls: ['./fightersection.component.css']
})
export class FightersectionComponent implements OnInit {
  @Input() type: string;

  constructor(
    public counterService: CounterService,
    private dialog: MatDialog,
    public fieldService: FieldService
  ) { }

  ngOnInit() { }

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
        let wound = +event.target.value === 0 ? '00' : +event.target.value * 100 / fighters[i].max_health;
        if (wound > 0 && wound < 25) {
          wound = 10
        } else if (wound >= 25 && wound < 50) {
          wound = 25
        } else if (wound >= 50 && wound < 75) {
          wound = 50
        } else if (wound >= 75 && wound < 100) {
          wound = 75
        } else if (wound >= 100) {
          wound = ''
        }
        this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: wound, id: fighterId, fighterProperty: 'wound' })
        i = fighters.length
      }
    }
  }
}
