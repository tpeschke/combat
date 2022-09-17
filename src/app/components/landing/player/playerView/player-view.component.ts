import { Component, OnInit } from '@angular/core';
import { FieldService } from 'src/app/utils/field.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/utils/general.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['../../battlefield/fighter-section/fightersection.component.css']
})
export class PlayerViewComponent implements OnInit {

  constructor(
    private fieldService: FieldService,
    private generalService: GeneralService,
    private router: Router
  ) { }

  public canPlayersView = false
  public addFromOtherSite = false
  public hash;
  public count;
  public name;
  public fighters = [];
  public statuses = []
  public players: any = [];
  public id = null;
  public newPlayer = {
    id: null,
    name: null,
    recovery: null,
    action: null,
    initMod: null,
    initDice: '0',
    selectedId: null,
    topcheck: '0',
    trauma: false,
    weapons: [],
    newWeapon: { name: null, recovery: null }
  }

  ngOnInit() {
    this.hash = this.router.url.split('/')[1]
    this.fieldService.getBattleName(this.hash).subscribe(name => this.name = name[0].namecombat)
    this.fieldService.getBattleInfo({ hash: this.hash })
    this.fieldService.subscribeToBattle(this.hash)
      .subscribe(data => {
        let { type, value, id, fighterProperty } = data;
        if (type === 'fighterChange') {
          for (let i = 0; i < this.fighters.length; i++) {
            if (this.fighters[i].id === id) {
              this.fighters[i][fighterProperty] = value
              i = this.fighters.length
            }
          }
        } else if (type === 'removeFighter') {
          for (let i = 0; i < this.fighters.length; i++) {
            if (this.fighters[i].id === value) {
              this.fighters.splice(i, 1)
              i = this.fighters.length
            }
          }
        } else if (type === 'addFighter') {
          this.fighters = this.fighters.concat(data.value)
        } else if (type === 'removeStatus') {
          for (let i = 0; i < this.statuses.length; i++) {
            if (this.statuses[i].id === value) {
              this.statuses.splice(i, 1)
              i = this.statuses.length
            }
          }
        } else if (type === 'addStatus') {
          this.statuses = this.statuses.concat(data.value)
        } else if (type === 'updateStatus') {
          this.statuses = this.statuses.map(val => {
            if (val.id === data.value.id) {
              return data.value
            } else {
              return val
            }
          })
        } else {
          this[type] = value
          if (type === 'count') {
            this.players = this.players.map(player => {
              if (player.topcheck === '1' && value === player.action) { player.topcheck = '0' }
              return player
            })
          }
        }
        if (type === 'canPlayersView' && value && !this.canPlayersView) { this.fieldService.getBattleInfo({ hash: this.hash }) }
      })
  }

  capturePlayerInfo(type, event) {
    if (type === 'recovery') {
      this.newPlayer[type] = +event.target.value.replace(/\D/g, '')
    } else {
      this.newPlayer[type] = event.target.value
    }
  }

  addPlayer() {
    let { name, recovery, action } = this.newPlayer
    if (name !== '' && recovery) {
      this.newPlayer.id = this.generalService.makeid();
      this.players.push(this.newPlayer)
      this.newPlayer = {
        id: null,
        name: null,
        recovery: null,
        action: null,
        initMod: null,
        initDice: '0',
        selectedId: null,
        topcheck: '0',
        trauma: false,
        weapons: [],
        newWeapon: { name: null, recovery: null }
      }
    }
  }

  clearPlayerInfo() {
    this.newPlayer = {
      id: null,
      name: null,
      recovery: null,
      action: null,
      initMod: null,
      initDice: '0',
      selectedId: null,
      topcheck: '0',
      trauma: false,
      weapons: [],
      newWeapon: { name: null, recovery: null }
    }
  }

  alterRecovery(id, event) {
    this.players = this.players.map(player => {
      if (player.id === id) {
        player.recovery = +event.target.value.replace(/\D/g, '')
      }
      return player
    })
  }

  increaseAction(id) {
    this.players = this.players.map(player => {
      if (player.id === id) {
        if (player.action < this.count) {
          player.action = this.count + player.recovery
        } else {
          player.action = player.action + player.recovery
        }
      }
      return player
    })
  }

  jumpToCount(id) {
    this.players = this.players.map(player => {
      if (player.id === id) {
        player.action = this.count
      }
      return player
    })
  }

  changeAction(id, event) {
    this.players = this.players.map(player => {
      if (player.id === id) {
        player.action = +event.target.value.replace(/\D/g, '')
      }
      return player
    })
  }

  toggleTrauma(id) {
    this.players = this.players.map(player => {
      if (player.id === id) {
        player.trauma = true
      }
      return player
    })
  }

  addTrauma(id, event) {
    let traumaValue = +event.target.value.replace(/\D/g, '')
    this.players = this.players.map(player => {
      if (player.id === id) {
        player.trauma = false
        if (traumaValue > 0) {
          player.topcheck = '1'
          player.action = this.count + (traumaValue * 3)
        }
      }
      return player
    })
  }

  removePlayer(id) {
    this.players.forEach((player, index) => {
      if (player.id === id) {
        this.players.splice(index, 1)
      }
    })
  }

  toggleAddFromOtherSite() {
    this.addFromOtherSite = !this.addFromOtherSite
    if (this.addFromOtherSite) {
      this.id = null;
    }
  }

  captureId(event) {
    this.id = event.target.value
  }

  selectWeapon(playerid, weaponid) {
    this.players.forEach(player => {
      if (player.id === playerid) {
        player.weapons.forEach(weapon => {
          if (weapon.weaponid === weaponid) {
            player.selectedId = weapon.weaponid
            player.selectedName = weapon.name
            player.recovery = weapon.recovery
          }
        })
      }
    })
  }

  saveNewWeapon(playerid, type, event) {
    this.players.forEach(player => {
      if (player.id === playerid) {
        if (type === 'recovery') {
          player.newWeapon[type] = +event.target.value
        } else {
          player.newWeapon[type] = event.target.value
        }
      }
    })
  }

  addNewWeapon(playerid) {
    this.players.forEach(player => {
      if (player.id === playerid) {
        player.weapons.push({ ...player.newWeapon, id: this.generalService.makeid() })
        player.newWeapon = { name: null, recovery: null }
      }
    })
  }

  addPlayerOrBeast() {
    let id = this.id.replace(/\#/g, '').trim();
    if (isNaN(+id)) {
      this.fieldService.getBeastForPlayer(id).subscribe((beast: any) => {
        if (beast.name !== '' && beast.recovery && this.newPlayer.action) {
          this.newPlayer = { ...this.newPlayer, ...beast };
          let count = 0
          if (this.count) {
            count = this.count
          }
          this.newPlayer.action = this.newPlayer.action + count;
          this.newPlayer.id = this.generalService.makeid();
          this.players.push(this.newPlayer)
          this.newPlayer = {
            id: null,
            name: null,
            recovery: null,
            selectedId: null,
            action: null,
            initMod: null,
            initDice: '0',
            topcheck: '0',
            trauma: false,
            weapons: [],
            newWeapon: { name: null, recovery: null }
          }
          this.addFromOtherSite = false;
          this.id = null;
        }
      })
    } else if (!isNaN(+id)) {
      this.fieldService.getCharacterFromVault(id).subscribe((character: any) => {
        if (character.name !== '' && character.recovery && this.newPlayer.action) {
          this.newPlayer = { ...this.newPlayer, ...character };
          let count = 0
          if (this.count) {
            count = this.count
          }
          this.newPlayer.action = this.newPlayer.action + count;
          this.newPlayer.id = this.generalService.makeid();
          this.players.push(this.newPlayer)
          this.newPlayer = {
            id: null,
            name: null,
            recovery: null,
            selectedId: null,
            action: null,
            initMod: null,
            initDice: '0',
            topcheck: '0',
            trauma: false,
            weapons: [],
            newWeapon: { name: null, recovery: null }
          }
          this.addFromOtherSite = false;
          this.id = null;
        }
      })
    }
  }

  selectInitDice(dice, id) {
    if (!id) {
      this.newPlayer.initDice = dice
    } else {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id === id) {
          this.players[i].initDice = dice
          i = this.players.length
        }
      }
    }
  }

  rollInitiative(id) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === id) {
        let { initDice, initMod } = this.players[i]
        this.players[i].action = this.generalService.rollDice(`1d${initDice}${initMod < 0 ? initMod : '+' + initMod}`)
        i = this.players.length
      }
    }
  }
}
