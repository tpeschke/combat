import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CounterService } from 'src/app/utils/counter.service';
import { FieldService } from 'src/app/utils/field.service';

@Component({
  selector: 'app-weapon-select',
  templateUrl: './weapon-select.component.html',
  styleUrls: ['./weapon-select.component.css']
})
export class WeaponSelectComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WeaponSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public counterService: CounterService,
    public fieldService: FieldService
  ) { }

  public id = this.data.id
  public weapons = this.data.weapons

  ngOnInit() {
  }

  selectWeapon(event, weaponId) {
    event.stopPropagation();
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.id) {
        fighters[i].weapons = fighters[i].weapons.map(weapon => {
          if (weapon.selected === '1') {
            weapon.selected = '0'
          }
          if (weapon.id === weaponId) {
            weapon.selected = '1'
            fighters[i].selected = weapon
            this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: fighters[i].selected.weapon, id: fighters[i].id, fighterProperty: 'weapon' })
          }
          return weapon
        })
        i = fighters.length
      }
    }
    this.dialogRef.close();
  }

}
