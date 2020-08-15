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

  public canPlayersView = true
  public hash;
  public fighters = [];
  public statuses = []

  ngOnInit() {
    this.hash = this.router.url.split('/')[1]
    this.fetchFighters()
    this.fieldService.subscribeToBattle(this.hash)
      .subscribe(data => {
        this[data.type] = data.value
        this.fetchFighters()
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
