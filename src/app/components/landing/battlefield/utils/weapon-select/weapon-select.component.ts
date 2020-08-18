import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CounterService } from 'src/app/utils/counter.service';
import { FieldService } from 'src/app/utils/field.service';
import { GeneralService } from 'src/app/utils/general.service';

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
    public fieldService: FieldService,
    public generalService: GeneralService
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

  changeWeaponProperty(weaponId, event, property) {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.id) {
        fighters[i].weapons = fighters[i].weapons.map((weapon, weaponIndex) => {
          if (weapon.id === weaponId) {
            fighters[i].weapons[weaponIndex][property] = event.target.value
            if (weapon.selected === '1') {
              fighters[i].selected[property] = event.target.value
            }
          }
          return weapon
        })
        i = fighters.length
      }
    }
  }

  addWeapon() {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.id) {
        fighters[i].weapons.push({
          id: this.generalService.makeid(),
          weapon: 'New Weapon',
          speed: 10,
          encumb: 10,
          selected: '0'
        })
        i = fighters.length
      }
    }
  }

}
