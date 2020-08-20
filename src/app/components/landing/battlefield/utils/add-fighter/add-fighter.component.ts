import { Component, OnInit } from '@angular/core';
import { WeaponSelectComponent } from '../weapon-select/weapon-select.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-add-fighter',
  templateUrl: './add-fighter.component.html',
  styleUrls: ['./add-fighter.component.css']
})
export class AddFighterComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  public fighter = {
    colorcode: '#000000',
    namefighter: '',
    health: 0,
    max_health: 0,
    stress: 0,
    stressthreshold: 0,
    weapons: [],
    selected: null,
    actioncount: [1]
  }
  public multiAdd = null

  ngOnInit() {
  }

  captureChange(event, type) {
    this[type] = event
  }

  openWeaponSelect() {
    this.dialog.open(WeaponSelectComponent, {
      panelClass: 'dialogStyling',
      data: {
        weapons: this.fighter.weapons
      }
    }).afterClosed().subscribe(_=> {
      for (let i = 0; i < this.fighter.weapons.length; i++) {
        if (this.fighter.weapons[i].selected === '1') {
          this.fighter.selected = this.fighter.weapons[i]
        }
      }
    });
  }
}
