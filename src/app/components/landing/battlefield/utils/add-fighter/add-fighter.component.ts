import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { WeaponSelectComponent } from '../weapon-select/weapon-select.component';
import { MatDialog, MatExpansionPanel } from '@angular/material';
import { CounterService } from 'src/app/utils/counter.service';
import { GeneralService } from 'src/app/utils/general.service';

@Component({
  selector: 'app-add-fighter',
  templateUrl: './add-fighter.component.html',
  styleUrls: ['./add-fighter.component.css']
})
export class AddFighterComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;

  constructor(
    private dialog: MatDialog,
    private counterService: CounterService,
    private generalService: GeneralService
  ) { }

  public fighter = {
    id: null,
    hidden: '0',
    colorcode: '#000000',
    namefighter: '',
    health: 0,
    max_health: 0,
    dead: '0',
    stress: 0,
    stressthreshold: 0,
    acting: '0',
    weapons: [{
      id: this.generalService.makeid(),
      weapon: 'New Weapon',
      speed: 10,
      encumb: 10,
      selected: '1',
      init: 0
    }],
    selected: null,
    actioncount: [1]
  }
  public multiAdd = null
  public uniqueColors = false
  public numberEach = false

  ngOnInit() {
    this.fighter.selected = this.fighter.weapons[0]
  }

  captureChange(value, type) {
    this.fighter[type] = value
  }

  captureChangeInt(value, type) {
    this.fighter[type] = +value
  }

  captureMultiAdd(value) {
    this.multiAdd = value
  }

  selectInitDice(dice) {
    this.fighter.actioncount[0] = dice
  }

  openWeaponSelect() {
    this.dialog.open(WeaponSelectComponent, {
      panelClass: 'dialogStyling',
      data: {
        weapons: this.fighter.weapons
      }
    }).afterClosed().subscribe(_ => {
      for (let i = 0; i < this.fighter.weapons.length; i++) {
        if (this.fighter.weapons[i].selected === '1') {
          this.fighter.selected = this.fighter.weapons[i]
        }
      }
    });
  }

  toggleUniqueColors(checked) {
    this.uniqueColors = checked
  }

  toggleNumbering(checked) {
    this.numberEach = checked
  }

  addFighter() {
    if (this.checkIfFighterIsValid()) {
      if (this.multiAdd && this.multiAdd > 1) {
        let colors = ['#C91010', '#1076C9', '#2889e9', '#2FC910', '#C97310', '#9510C9', '#EB75E1', '#E5EB75']
        let newFighters = []
        for (let i = 0; i < this.multiAdd; i++) {
          let fighterCopy = {...this.fighter}
          fighterCopy.id = this.generalService.makeid()
          if (this.numberEach) { fighterCopy.namefighter = fighterCopy.namefighter + ` ${i + 1}` }
          if (this.uniqueColors) { 
            i > 7 ? fighterCopy.colorcode = this.generalService.genHexString() : fighterCopy.colorcode = colors[i]
          }
          newFighters.push({ ...fighterCopy })
        }
        this.counterService.addFighter(newFighters);
        // add fighters to player view
        this.counterService.sort()
      } else {
        this.fighter.id = this.generalService.makeid()
        this.counterService.addFighter([this.fighter]);
        // add fighter to player view
        this.counterService.sort()
      }
      this.viewPanels.forEach(p => p.close());
      this.multiAdd = null
      this.uniqueColors = false
      this.numberEach = false
      let newId = this.generalService.makeid()
      this.fighter = {
        id: null,
        hidden: '0',
        colorcode: '#000000',
        namefighter: '',
        health: 0,
        max_health: 0,
        stress: 0,
        dead: '0',
        acting: '0',
        stressthreshold: 0,
        weapons: [{
          id: newId,
          weapon: 'Unarmed',
          speed: 10,
          encumb: 10,
          selected: '1',
          init: 0
        }],
        selected: {
          id: newId,
          weapon: 'Unarmed',
          speed: 10,
          encumb: 10,
          selected: '1',
          init: 0
        },
        actioncount: [1]
      }
    }
  }

  checkIfFighterIsValid() {
    return true
  }
}
