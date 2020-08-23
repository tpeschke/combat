import { Component, OnInit } from '@angular/core';
import { FieldService } from 'src/app/utils/field.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/utils/general.service';

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
  public hash;
  public count;
  public name;
  public fighters = [];
  public statuses = []
  public players = [];
  public newPlayer = {
    id: null,
    name: null,
    recovery: null,
    action: null,
    topcheck: '0',
    trauma: false
  }

  ngOnInit() {
    this.hash = this.router.url.split('/')[1]
    this.fieldService.getBattleName(this.hash).subscribe(name => this.name = name[0].namecombat)
    this.fieldService.getBattleInfo({hash: this.hash})
    this.fieldService.subscribeToBattle(this.hash)
      .subscribe(data => {
        let {type, value, id, fighterProperty} = data;
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
        } else {
          this[type] = value
          if(type === 'count') {
            this.players = this.players.map(player => {
              if (player.topcheck === '1' && value === player.action) {player.topcheck = '0'}
              return player
            })
          }
        }
        if (type === 'canPlayersView' && value) { this.fieldService.getBattleInfo({hash: this.hash}) }
      })
  }

  fetchFighters() {
    if (this.canPlayersView) {
      this.fieldService.getFightersForPlayers(this.hash).subscribe(data => {
        this.fighters = data[0]
        this.statuses = data[0]
      })
    }
  }

  capturePlayerInfo(type, event) {
    if (type === 'name') {
      this.newPlayer[type] = event.target.value
    } else {
      this.newPlayer[type] = +event.target.value.replace(/\D/g,'')
    }
  }

  addPlayer() {
    let {name, recovery, action} = this.newPlayer
    if (name !== '' && recovery && action) {
      this.newPlayer.action = this.newPlayer.action + this.count;
      this.newPlayer.id = this.generalService.makeid();
      this.players.push(this.newPlayer)
      this.newPlayer = {
        id: null,
        name: null,
        recovery: null,
        action: null,
        topcheck: '0',
        trauma: false
      }
    }
  }

  clearPlayerInfo() {
    this.newPlayer = {
      id: null,
      name: null,
      recovery: null,
      action: null,
      topcheck: '0',
      trauma: false
    }
  }

  alterRecovery(id, event) {
    this.players = this.players.map(player => {
      if (player.id === id) {
        player.recovery = +event.target.value.replace(/\D/g,'')
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
        player.action = +event.target.value.replace(/\D/g,'')
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
    this.players = this.players.map(player => {
      if (player.id === id) {
        player.trauma = false
        player.topcheck = '1'
        player.action = this.count + (+event.target.value.replace(/\D/g,'') * 3)
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

}
