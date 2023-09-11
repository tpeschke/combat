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
    fatigue: 'C',
    panic: 7,
    fatiguenumber: null,
    panicnumber: null,
    caution: 0,
    weapons: [{
      id: this.generalService.makeid(),
      weapon: 'Unarmed',
      speed: 10,
      fatigue: 'C',
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
        let weapons = []
          , selected = null

        beast.combatStatArray.forEach(({ combatSquare }) => {
          const { weaponname, defaultweaponname, recovery, attack, initiative, defense, cover, damageType, dr, damage, measure, range, parry, shieldDr} = combatSquare
          weapons.push({
            id: this.generalService.makeid(),
            weapon: weaponname ? weaponname : defaultweaponname,
            speed: recovery,
            atk: attack,
            init: initiative,
            def: defense,
            dr,
            shield_dr: shieldDr,
            measure,
            damage,
            parry,
            weapontype: range ? 'r' : 'm',
            damagetype: damageType,
            cover,
            selected: '0',
            maxrange: range ? range * 6 : null
          })
        })

        weapons[0].selected = '1'
        selected = weapons[0]

        this.fighter = {
          id: null,
          hidden: '0',
          colorcode: '#000000',
          namefighter: beast.name,
          health: 0,
          max_health: beast.phyiscalAndStress.physical.diceString ? beast.phyiscalAndStress.physical.diceString : 10000,
          dead: '0',
          stress: 0,
          fatigue: beast.phyiscalAndStress.physical.fatigue === 'N' ? 'N' : null,
          panic: beast.phyiscalAndStress.mental.panic === 'N' ? 7 : null,
          fatiguenumber: beast.phyiscalAndStress.physical.fatigue !== 'N' ? beast.phyiscalAndStress.physical.fatigue : null,
          caution: beast.phyiscalAndStress.mental.caution !,
          panicnumber: beast.phyiscalAndStress.mental.panic !== 'N' ? beast.phyiscalAndStress.mental.panic : null,
          stressthreshold: beast.phyiscalAndStress.mental.stress !== "N" ? beast.phyiscalAndStress.mental.stress : 0,
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

  selectFatigueThreshold(fatigue) {
    this.fighter.fatigue = fatigue
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
          if (isNaN(+fighterCopy.max_health)) {
            fighterCopy.max_health = this.generalService.rollDice(fighterCopy.max_health);
          }
          fighterCopy.weapons = fighterCopy.weapons.map(weapon => { return { ...weapon, id: this.generalService.makeid() } })
          if (this.numberEach) { fighterCopy.namefighter = fighterCopy.namefighter + ` ${i + 1}` }
          if (this.uniqueColors) { i > 6 ? fighterCopy.colorcode = this.generalService.genHexString() : fighterCopy.colorcode = colors[i] }
          newFighters.push(fighterCopy)
        }
        this.counterService.addFighter(newFighters);
      } else {
        if (isNaN(+this.fighter.max_health)) {
          this.fighter.max_health = this.generalService.rollDice(this.fighter.max_health);
        }
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
        fatigue: 'C',
        fatiguenumber: null,
        panicnumber: null,
        panic: 7,
        caution: 0,
        weapons: [{
          id: newId,
          weapon: 'Unarmed',
          speed: 10,
          fatigue: 'C',
          selected: '1',
          init: 0
        }],
        selected: {
          id: newId,
          weapon: 'Unarmed',
          speed: 10,
          fatigue: 'C',
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
      && this.fighter.max_health
      && this.fighter.selected.speed > 0
      && !isNaN(+this.fighter.selected.init)
      && ((this.fighter.fatiguenumber && this.fighter.fatiguenumber > 0) || (this.fighter.fatigue === 'A' || this.fighter.fatigue === 'H' || this.fighter.fatigue === 'B' || this.fighter.fatigue === 'W' || this.fighter.fatigue === 'C' || this.fighter.fatigue === 'N'))
      && this.fighter.selected.weapon !== ''

    this.errors = []
    if (this.fighter.namefighter === '') { this.errors.push("Name Required") }
    if (this.fighter.max_health === 0) { this.errors.push("Max Vitality Required") }
    if (this.fighter.max_health < this.fighter.health) { this.errors.push("Damage Can't Be Greater Than Max Vitality") }
    if (this.fighter.selected.speed < 0) { this.errors.push("Weapon Recovery Required") }
    if (isNaN(+this.fighter.selected.init)) { this.errors.push("Weapon Initiative Required") }
    if (this.fighter.fatiguenumber) {
      if (this.fighter.fatiguenumber > 0) { this.errors.push("Fatigue needs to be a Positive Number") }
    } else {
      if (this.fighter.fatigue !== 'A' && this.fighter.fatigue !== 'H' && this.fighter.fatigue !== 'B' && this.fighter.fatigue !== 'W' && this.fighter.fatigue !== 'C' && this.fighter.fatigue !== 'N') { this.errors.push("Fatigue needs to be an A, H, B, W, C, or N") }
    }

    return isValid
  }
}
