import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private counterService: CounterService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['battle']) {
        this.counterService.count = data['battle'].meta.count
        this.counterService.name = data['battle'].meta.name
        this.counterService.hash = data['battle'].meta.hash
        this.counterService.id = data['battle'].meta.id
        this.counterService.fighters = data['battle'].fighters
      } else {
        this.counterService.name = 'New Battlefield'
        this.counterService.count = 1
      }
    })
  }

  

}
