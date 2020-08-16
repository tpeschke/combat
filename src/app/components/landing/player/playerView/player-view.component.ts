import { Component, OnInit } from '@angular/core';
import { FieldService } from 'src/app/utils/field.service';
import { Router } from '@angular/router';
import { CounterService } from 'src/app/utils/counter.service';

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
        this[data.type] = data.value
        if (data.type === 'canPlayersView' && data.value) { this.fieldService.getBattleInfo({hash: this.hash}) }
        if (this.fighters.length === 0) {this.fetchFighters()}
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
