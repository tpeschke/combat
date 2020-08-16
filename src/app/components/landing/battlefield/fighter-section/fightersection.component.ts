import { Component, OnInit, Input } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';
import { FieldService } from 'src/app/utils/field.service';
import { MatDialog } from '@angular/material';
import { WeaponSelectComponent } from '../utils/weapon-select/weapon-select.component';

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
}
