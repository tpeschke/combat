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

  ngOnInit() {}

  selectWeapon(event, weaponId) {
    event.stopPropagation();
    let { fighters } = this.counterService
    if (this.id) {
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
    } else {
      this.weapons.forEach(weapon => {
        if (weapon.id === weaponId) {
          weapon.selected = '1'
        } else {
          weapon.selected = '0'
        }
      })
    }
    this.dialogRef.close();
  }

  changeWeaponProperty(weaponId, event, property) {
    event.stopPropagation();
    let { fighters } = this.counterService
    if (this.id) {
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
    } else {
      this.weapons = this.weapons.map((weapon, weaponIndex) => {
        if (weapon.id === weaponId) {
          this.weapons[weaponIndex][property] = event.target.value
        }
        return weapon
      })
    }
  }

  changeWeaponPropertyInt(weaponId, event, property) {
    let { fighters } = this.counterService
    if (this.id) {
      for (let i = 0; i < fighters.length; i++) {
        if (fighters[i].id === this.id) {
          fighters[i].weapons = fighters[i].weapons.map((weapon, weaponIndex) => {
            if (weapon.id === weaponId) {
              fighters[i].weapons[weaponIndex][property] = this.generalService.stripNonInt(event.target.value)
              if (weapon.selected === '1') {
                fighters[i].selected[property] = this.generalService.stripNonInt(event.target.value)
              }
            }
            return weapon
          })
          i = fighters.length
        }
      }
    } else {
      this.weapons = this.weapons.map((weapon, weaponIndex) => {
        if (weapon.id === weaponId) {
          this.weapons[weaponIndex][property] = this.generalService.stripNonInt(event.target.value)
        }
        return weapon
      })
    }
  }

  addWeapon() {
    let { fighters } = this.counterService
    if (this.id) {
      for (let i = 0; i < fighters.length; i++) {
        if (fighters[i].id === this.id) {
          fighters[i].weapons.push({
            id: this.generalService.makeid(),
            weapon: 'New Weapon',
            speed: 10,
            encumb: 10,
            selected: '0',
            init: 0
          })
          i = fighters.length
        }
      }
    } else {
      this.weapons.push({
        id: this.generalService.makeid(),
        weapon: 'New Weapon',
        speed: 10,
        encumb: 10,
        init: 0,
        selected: this.weapons.length === 0 ? '1' : '0'
      })
    }
  }

  copyWeapon(weapon) {
    let { fighters } = this.counterService
    , weaponCopy = {...weapon}
    weaponCopy.id = this.generalService.makeid()
    weaponCopy.weapon = weaponCopy.weapon + " (Copy)"
    weaponCopy.selected = "0"
    if (this.id) {
      for (let i = 0; i < fighters.length; i++) {
        if (fighters[i].id === this.id) {
          fighters[i].weapons.push(weaponCopy)
          i = fighters.length
        }
      }
    } else {
      this.weapons.push(weaponCopy)
    }
  }

  deleteWeapon(weaponId) {
    let { fighters } = this.counterService
    if (this.id) {
      for (let i = 0; i < fighters.length; i++) {
        if (fighters[i].id === this.id) {
          for (let x = 0; x < fighters[i].weapons.length; x++) {
            if (fighters[i].weapons[x].id === weaponId) {
              fighters[i].weapons.splice(x, 1)
              this.fieldService.deleteWeapon(weaponId).subscribe().unsubscribe()
              x = fighters[i].weapons.length
            }
          }
          i = fighters.length
        }
      }
    } else {
      for (let i = 0; i < this.weapons.length; i++) {
        if (this.weapons[i].id === weaponId) {
          this.weapons.splice(i, 1)
          i = this.weapons.length
        }
      }
    }
  }

}
