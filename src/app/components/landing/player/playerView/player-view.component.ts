import { Component, OnInit } from '@angular/core';
import { FieldService } from 'src/app/utils/field.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.css']
})
export class PlayerViewComponent implements OnInit {

  constructor(
    private fieldService: FieldService,
    private router: Router
  ) { }

  public canPlayersView = false

  ngOnInit() {
    this.fieldService.subscribeToBattle(this.router.url.split('/')[1])
      .subscribe(data => {
        this[data.type] = data.value
      })
  }

}
