import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';
import { MatDialog } from '@angular/material';
import { FieldService } from 'src/app/utils/field.service';
import { WeaponSelectComponent } from '../../../utils/weapon-select/weapon-select.component';
import { GeneralService } from 'src/app/utils/general.service';
import tooltips from '../../../../../../utils/tooltips'

@Component({
  selector: 'app-singlefighter',
  templateUrl: './singlefighter.component.html',
  styleUrls: ['./../../fightersection.component.css']
})
export class SinglefighterComponent implements OnInit {
  @Input() fighter: any;
  @ViewChild('inputFocus') public inputFocus: ElementRef;

  constructor(
    public counterService: CounterService,
    private dialog: MatDialog,
    public fieldService: FieldService,
    public generalService: GeneralService
  ) {
    this.tooltips = tooltips
  }

  public trauma = false;
  public editOn = false;
  public broken = false;
  public fatigued = false;
  public panicked = false;
  public cautious = false;
  public nameChange;
  public colorChange;
  public maxHealthChange;
  public fatigueNumberChange;
  public panicNumberChange;
  public stessThresholdChange;
  public tooltips;

  ngOnInit() {
    this.nameChange = this.fighter.namefighter
    this.colorChange = this.fighter.colorcode
    this.maxHealthChange = this.fighter.max_health
    this.fatigueNumberChange = this.fighter.fatiguenumber
    this.panicNumberChange = this.fighter.panicnumber
    this.stessThresholdChange = this.fighter.stressthreshold
    this.calculateWoundCategory();
    this.calculateStressCategory();
  }

  calculateWoundCategory() {
    let wound = this.fighter.health * 100 / this.fighter.max_health;
    if (wound === 0) {
      wound = 0
      this.calculateFatigue('A')
    } if (wound > 0 && wound < 25) {
      //Hurt
      wound = 1
      this.calculateFatigue('H')
    } else if (wound >= 25 && wound < 50) {
      //Bloodied
      wound = 25
      this.calculateFatigue('B')
    } else if (wound >= 50 && wound < 75) {
      //Wounded
      wound = 50
      this.calculateFatigue('W')
    } else if (wound >= 75 && wound < 100) {
      //Critical
      wound = 75
      this.calculateFatigue('C')
    } else if (wound >= 100) {
      //Dead
      this.calculateFatigue('N')
      wound = 100
    }
    this.fighter.woundCategory = wound
    this.calculateCaution()
  }

  calculateStressCategory() {
    let stress = this.fighter.stress * 100 / this.fighter.stressthreshold;
    if (stress === 0) {
      stress = 0
      this.calculatePanic(1)
    } if (stress > 0 && stress < 25) {
      //Unsure
      stress = 1
      this.calculatePanic(2)
    } else if (stress >= 25 && stress < 50) {
      //Nervous
      stress = 25
      this.calculatePanic(3)
    } else if (stress >= 50 && stress < 75) {
      //Shaken
      stress = 50
      this.calculatePanic(4)
    } else if (stress >= 75 && stress < 100) {
      //Breaking
      stress = 75
      this.calculatePanic(5)
    } else if (stress >= 100) {
      //Broken
      this.calculatePanic(7)
      stress = 100
    }
    this.fighter.stressCategory = stress
    this.calculateBroken()
    this.calculateCaution()
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
    let { stripNonInt } = this.generalService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === fighterId) {
        let newDamage = stripNonInt(event.target.value)
          , traumaThreshold = fighters[i].max_health / 2
          , damageDifference = newDamage - fighters[i].health
        if (damageDifference > traumaThreshold) {
          this.flagTrauma(Math.floor(damageDifference - traumaThreshold))
        }
        fighters[i].health = newDamage
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

  flagTrauma(traumaMod) {
    this.generalService.handleMessage({
      color: 'yellow',
      message: `That hit triggered a Trauma Check for ${this.fighter.namefighter} ${traumaMod > 0 ? `with a -${traumaMod}` : ''}`
    })
  }

  changeStress(event, fighterId) {
    let { fighters } = this.counterService
    let { stripNonInt } = this.generalService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === fighterId) {
        fighters[i].stress = stripNonInt(event.target.value)
        this.calculateBroken()
        this.calculateStressCategory()
        let stress = this.fighter.stressCategory === 0 ? '00' : this.fighter.stressCategory;
        if (stress === 1) {
          stress = 10
        } else if (stress === 100) {
          stress = ''
        }
        this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: stress, id: fighterId, fighterProperty: 'stress' })
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

  increaseActionToAboveCount() {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].actioncount = this.counterService.count + 2
        this.counterService.sort()
        i = fighters.length
      }
    }
  }

  jumpToCount() {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].actioncount = this.counterService.count
        this.counterService.sort()
        i = fighters.length
      }
    }
  }

  rollInitiative() {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].actioncount = this.generalService.rollDice(`1d${this.fighter.actioncount[0]}+${this.fighter.selected.init}`) + this.counterService.count
        this.counterService.sort()
        i = fighters.length
      }
    }
  }

  changeInitiative(event) {
    let { fighters } = this.counterService
    let { stripNonInt } = this.generalService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].actioncount = stripNonInt(event.target.value)
        this.counterService.sort()
        i = fighters.length
      }
    }
  }

  selectInitDice(dice) {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].actioncount[0] = +dice
        this.counterService.sort()
        i = fighters.length
      }
    }
  }

  calculateBroken() {
    let broken = this.fighter.stress >= this.fighter.stressthreshold && this.fighter.stressthreshold > 0;
    if (this.fighter.broken != broken) {
      this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: broken, id: this.fighter.id, fighterProperty: 'broken' })
    }
    if (broken) {
      this.broken = true
    } else {
      this.broken = false
    }
  }

  calculateCaution() {
    let cautious = this.fighter.stress + this.fighter.health > this.fighter.caution && this.fighter.caution !== 0;
    if (this.fighter.cautious != cautious) {
      this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: cautious, id: this.fighter.id, fighterProperty: 'cautious' })
    }
    if (cautious) {
      this.cautious = true
    } else {
      this.cautious = false
    }
  }

  showTrauma() {
    this.trauma = !this.trauma;
    if (this.trauma) {
      setTimeout(_ => {
        document.getElementById('focusInput').focus()
      }, 10)
    }
  }

  enterTrauma(event) {
    if (event.target.value) {
      let { fighters } = this.counterService
      for (let i = 0; i < fighters.length; i++) {
        if (fighters[i].id === this.fighter.id) {
          fighters[i].actioncount = this.counterService.count + (this.generalService.stripNonInt(event.target.value) * 3)
          fighters[i].topcheck = '1'
          this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: '1', id: this.fighter.id, fighterProperty: 'topcheck' })
          this.counterService.sort()
          i = fighters.length
        }
      }
    }
  }

  killFighter() {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].dead = '1'
        this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: '1', id: this.fighter.id, fighterProperty: 'dead' })
        i = fighters.length
      }
    }
  }

  toggleEdit() {
    if (this.editOn && this.nameChange || this.colorChange || this.maxHealthChange || this.stessThresholdChange || this.fatigueNumberChange) {
      let { fighters } = this.counterService
      for (let i = 0; i < fighters.length; i++) {
        if (fighters[i].id === this.fighter.id) {
          fighters[i].namefighter = this.nameChange
          this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: this.nameChange, id: this.fighter.id, fighterProperty: 'namefighter' })
          fighters[i].colorcode = this.colorChange
          this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: this.colorChange, id: this.fighter.id, fighterProperty: 'colorcode' })
          fighters[i].max_health = this.maxHealthChange
          fighters[i].fatiguenumber = this.fatigueNumberChange
          fighters[i].panicnumber = this.panicNumberChange
          this.calculateWoundCategory()
          this.calculateStressCategory()
          let wound = this.fighter.woundCategory === 0 ? '00' : this.fighter.woundCategory;
          if (wound === 1) {
            wound = 10
          } else if (wound === 100) {
            wound = ''
          }
          this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: wound, id: this.fighter.id, fighterProperty: 'wound' })
          fighters[i].stressthreshold = this.stessThresholdChange
          this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: this.stessThresholdChange, id: this.fighter.id, fighterProperty: 'stressthreshold' })
          i = fighters.length
        }
      }
    }
    this.editOn = !this.editOn
  }

  captureChange(event, type) {
    event.stopPropagation()
    this[type] = event.target.value
  }

  captureColor(event) {
    this.colorChange = event;
  }

  selectPanicThreshold(event) {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].panic = +event
        i = fighters.length
      }
    }
  }

  selectFatigueThreshold(event) {
    let { fighters } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === this.fighter.id) {
        fighters[i].fatigue = event
        i = fighters.length
      }
    }
  }

  calculateFatigue(woundCode) {
    let fatigue = this.convertFatigue(this.fighter.fatigue)
      , oldFatigue = this.fatigued

    if (this.fighter.fatiguenumber) {
      this.fatigued = this.fighter.health >= this.fighter.fatiguenumber
    } else {
      if (woundCode === 'A') {
        this.fatigued = fatigue === 'A'
      } else if (woundCode === 'H') {
        this.fatigued = fatigue === 'H' || fatigue === 'A'
      } else if (woundCode === 'B') {
        this.fatigued = fatigue === 'H' || fatigue === 'A' || fatigue === 'B'
      } else if (woundCode === 'W') {
        this.fatigued = fatigue === 'H' || fatigue === 'A' || fatigue === 'B' || fatigue === 'W'
      } else if (woundCode === 'C') {
        this.fatigued = fatigue === 'H' || fatigue === 'A' || fatigue === 'B' || fatigue === 'W' || fatigue === 'C'
      } else if (woundCode === 'N') {
        this.fatigued = fatigue === 'H' || fatigue === 'A' || fatigue === 'B' || fatigue === 'W' || fatigue === 'C' || fatigue === 'C'
      } else {
        this.fatigued = false
      }
    }

    if (this.fatigued != oldFatigue) {
      this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: this.fatigued, id: this.fighter.id, fighterProperty: 'fatigued' })
    }
  }

  calculatePanic(stressCode) {
    let oldPanic = this.panicked
    if (this.fighter.panicnumber) {
      this.panicked = this.fighter.stress >= this.fighter.panicnumber
    } else {
      if (this.fighter.panic === 0) {
        this.panicked = false
      } else {
        this.panicked = stressCode >= this.fighter.panic
      }
    }

    if (this.panicked != oldPanic) {
      this.fieldService.sendBattleData({ hash: this.counterService.hash, type: 'fighterChange', value: this.panicked, id: this.fighter.id, fighterProperty: 'panicked' })
    }
  }

  convertFatigue(fatigue) {
    if (!fatigue) {
      let encumb = this.fighter.selected.encumb;

      if (encumb > 25) {
        return "A"
      } else if (encumb > 20) {
        return "H"
      } else if (encumb > 15) {
        return "B"
      } else if (encumb > 10) {
        return "W"
      } else if (encumb > 0) {
        return "C"
      } else {
        return "N"
      }
    } else {
      return fatigue
    }
  }

  calculateFatigueThreshold(fatigue) {
    fatigue = this.convertFatigue(fatigue);

    switch (fatigue) {
      case 'H':
        return 1
      case 'B':
        return (this.fighter.max_health * .25).toFixed(0)
      case 'W':
        return (this.fighter.max_health * .5).toFixed(0)
      case 'C':
        return (this.fighter.max_health * .75).toFixed(0)
      default:
        return fatigue
    }
  }
}
