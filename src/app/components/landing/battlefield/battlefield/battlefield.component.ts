import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CounterService } from 'src/app/utils/counter.service';
import variables from '../../../../local.js';
import { FieldService } from 'src/app/utils/field.service.js';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})
export class BattlefieldComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private counterService: CounterService,
    private fieldService: FieldService
  ) { }

  public canPlayersView = false;

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['battle']) {
        this.counterService.count = data['battle'].meta.count
        this.counterService.name = data['battle'].meta.name
        this.counterService.hash = data['battle'].meta.hash
        this.counterService.id = data['battle'].meta.id
        this.counterService.fighters = data['battle'].fighters
        this.counterService.sort()
      } else {
        this.counterService.name = 'New Battlefield'
        this.counterService.count = 1
      }
      
      this.fieldService.subscribeToBattleInfo(this.counterService.hash).subscribe(_ => {
        let {hash, count} = this.counterService
        if (this.canPlayersView) {
          this.fieldService.sendBattleData({hash, type: 'count', value: count})
        }
        this.fieldService.sendBattleData({hash, type: 'canPlayersView', value: this.canPlayersView})
      })
    }).unsubscribe();
  }

  copyHash() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = variables.url + this.counterService.hash;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  togglePlayerView(checked) {
    let {hash} = this.counterService
    this.canPlayersView = checked
    this.fieldService.sendBattleData({hash, type: 'canPlayersView', value: checked})
  }
}
