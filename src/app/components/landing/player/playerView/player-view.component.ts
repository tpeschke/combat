import { Component, OnInit } from '@angular/core';
import { FieldService } from 'src/app/utils/field.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['../../battlefield/fighter-section/fightersection.component.css']
})
export class PlayerViewComponent implements OnInit {

  constructor(
    private fieldService: FieldService,
    private router: Router
  ) { }

  public canPlayersView = false
  public hash;
  public count;
  public name;
  public fighters = [];
  public statuses = []

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
        } else {
          this[type] = value
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

}
