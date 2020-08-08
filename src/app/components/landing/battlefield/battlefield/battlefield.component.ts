import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/utils/general.service';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})
export class BattlefieldComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['battle']) {
        this.generalService.meta = data['battle'].meta
        this.generalService.fighters = data['battle'].fighters
      } else {
        this.generalService.meta = {name: 'New Battlefield', count: 0}

      }
    })
  }

}
