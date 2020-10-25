import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { WeaponSelectComponent } from '../weapon-select/weapon-select.component';
import { MatDialog, MatExpansionPanel } from '@angular/material';
import { GeneralService } from 'src/app/utils/general.service';
import { FieldService } from 'src/app/utils/field.service';
import { CounterService } from 'src/app/utils/counter.service';

@Component({
  selector: 'app-add-fighter',
  templateUrl: './add-fighter.component.html',
  styleUrls: ['./add-fighter.component.css']
})
export class AddFighterComponent implements OnInit {
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;

  constructor(
    private generalService: GeneralService,
    private counterService: CounterService,
    private fieldService: FieldService,
    private dialog: MatDialog
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
    panic: 7,
    weapons: [{
      id: this.generalService.makeid(),
      weapon: 'Unarmed',
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
  public hash = null
  public errors = []

  ngOnInit() {
    this.fighter.selected = this.fighter.weapons[0]
  }

  changeHash(value) {
    this.hash = value.trim()
  }

  addByHash() {
    if (this.hash) {
      this.fieldService.getFightersFromBestiary(this.hash).subscribe((beast: any) => {
        let max_health = beast.vitality.toUpperCase() !== "N/A" ? this.generalService.rollDice(beast.vitality) : 10000
          , stressthreshold = typeof beast.stressthreshold === "number" ? beast.stressthreshold : 0
          , weapons = []
          , noBase = true
          , selected = null
        beast.combat.forEach(val => {
          if (val.weapon !== 'Base') {
            let maxrange = val.ranges ? val.ranges.thirtytwo : null;
            weapons.push({ ...val, id: this.generalService.makeid(), weapon: val.weapon, speed: val.spd, selected: '0', encumb: val.encumb, maxrange })
            weapons.push({ ...val, id: this.generalService.makeid(), weapon: `${val.weapon} (IG)`, speed: val.spd + Math.ceil(val.measure / 2), selected: '0', encumb: val.encumb, maxrange })
          } else {
            noBase = false;
            let newId = this.generalService.makeid()
            weapons.push({ ...val, id: newId, weapon: "Unarmed", speed: 9 + +val.spd, selected: '1', encumb: +val.encumb, damage: `d6+${+val.damage + 1}` })
            selected = { ...val, id: newId, weapon: "Unarmed", speed: 9 + +val.spd, selected: '1', encumb: +val.encumb, damage: `d6+${+val.damage + 1}` }
            weapons.push({ ...val, id: this.generalService.makeid(), weapon: val.weapon, speed: val.spd, selected: '0', encumb: +val.encumb })
          }
        })
        if (weapons.length === 1 || noBase) {
          weapons[0].selected = '1'
          selected = weapons[0]
        }
        this.fighter = {
          id: null,
          hidden: '0',
          colorcode: '#000000',
          namefighter: beast.name,
          health: 0,
          max_health,
          dead: '0',
          stress: 0,
          panic: beast.panic,
          stressthreshold,
          acting: '0',
          weapons,
          selected,
          actioncount: [1]
        }
      })
    }
  }

  captureChange(event, type) {
    event.stopPropagation()
    this.fighter[type] = event.target.value
  }

  captureColor(value) {
    this.fighter.colorcode = value
  }

  captureHidden(value) {
    this.fighter.hidden = value
  }

  captureChangeInt(value, type) {
    this.fighter[type] = this.generalService.stripNonInt(value)
  }

  captureMultiAdd(value) {
    this.multiAdd = value
  }

  selectInitDice(dice) {
    this.fighter.actioncount[0] = dice
  }

  selectPanicThreshold(panic) {
    this.fighter.panic = panic
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
        let colors = ['#C91010', '#1076C9', '#2FC910', '#C97310', '#9510C9', '#EB75E1', '#E5EB75']
        let newFighters = []
        for (let i = 0; i < this.multiAdd; i++) {
          let fighterCopy = { ...this.fighter, id: this.generalService.makeid(), actioncount: [...this.fighter.actioncount], selected: { ...this.fighter.selected } }
          fighterCopy.weapons = fighterCopy.weapons.map(weapon => { return { ...weapon, id: this.generalService.makeid() } })
          if (this.numberEach) { fighterCopy.namefighter = fighterCopy.namefighter + ` ${i + 1}` }
          if (this.uniqueColors) { i > 6 ? fighterCopy.colorcode = this.generalService.genHexString() : fighterCopy.colorcode = colors[i] }
          newFighters.push({ ...fighterCopy })
        }
        this.counterService.addFighter(newFighters);
      } else {
        this.fighter.id = this.generalService.makeid()
        this.counterService.addFighter([this.fighter]);
      }
      this.viewPanels.forEach(p => p.close());
      this.multiAdd = null
      this.uniqueColors = false
      this.numberEach = false
      this.hash = null
      this.errors = []
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
        panic: 7,
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
    let isValid = false
    isValid = this.fighter.namefighter !== ''
      && this.fighter.max_health > 0
      && this.fighter.max_health >= this.fighter.health
      && this.fighter.selected.speed > 0
      && !isNaN(+this.fighter.selected.init)
      && this.fighter.selected.encumb >= 0
      && this.fighter.selected.weapon !== ''

    this.errors = []
    if (this.fighter.namefighter === '') { this.errors.push("Name Required") }
    if (this.fighter.max_health === 0) { this.errors.push("Max Vitality Required") }
    if (this.fighter.max_health < this.fighter.health) { this.errors.push("Damage Can't Be Greater Than Max Vitality") }
    if (this.fighter.selected.speed < 0) { this.errors.push("Weapon Recovery Required") }
    if (isNaN(+this.fighter.selected.init)) { this.errors.push("Weapon Initiative Required") }
    if (this.fighter.selected.encumb < 0) { this.errors.push("Encumbrance Required") }

    return isValid
  }
}
