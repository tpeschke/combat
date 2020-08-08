import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})
export class BattlefieldComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  private meta = {}
  private fighters = []

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['fighter']) {
        this.meta = data['fighter'].meta
        this.fighters = data['fighter'].fighters
      } else {
        this.meta = {namecombat: 'New Battlefield',
                    countnum: 0}
      }
    })
  }

}
