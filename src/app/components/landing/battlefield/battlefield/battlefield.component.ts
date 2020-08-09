import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CounterService } from 'src/app/utils/counter.service';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})
export class BattlefieldComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private counterService: CounterService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['battle']) {
        this.counterService.meta = data['battle'].meta
        this.counterService.fighters = data['battle'].fighters
      } else {
        this.counterService.meta = {name: 'New Battlefield', count: 0}

      }
    })
  }

}
