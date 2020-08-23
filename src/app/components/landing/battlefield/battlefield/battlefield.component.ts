import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CounterService } from 'src/app/utils/counter.service';
import variables from '../../../../local.js';
import tooltips from '../../../../utils/tooltips'
import { FieldService } from 'src/app/utils/field.service.js';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})
export class BattlefieldComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private counterService: CounterService,
    private fieldService: FieldService,
    ) {
      this.tooltips = tooltips
    }

  public canPlayersView = true;
  public tooltips;

  ngOnInit() {
    this.counterService.startAutoSaveTimer()
    this.route.data.subscribe(data => {
      if (data['battle'].meta.name) {
        this.counterService.count = data['battle'].meta.count
        this.counterService.name = data['battle'].meta.name
        this.counterService.hash = data['battle'].meta.hash
        this.counterService.id = data['battle'].meta.id
        this.counterService.fighters = data['battle'].fighters
        this.counterService.statuses = data['battle'].statuses
        this.counterService.sort()
      } else {
        this.counterService.name = 'New Battlefield'
        this.counterService.count = 1
        this.counterService.hash = data['battle'].meta.hash
        this.counterService.id = data['battle'].meta.id
        this.counterService.fighters = []
        this.counterService.statuses = []
        this.counterService.saveField()
      }
      
      this.fieldService.subscribeToBattleInfo(this.counterService.hash).subscribe(_ => {
        let {hash, count, formatFightersForPlayers, fighters, statuses} = this.counterService
        this.fieldService.sendBattleData({hash, type: 'canPlayersView', value: this.canPlayersView})
        if (this.canPlayersView) {
          this.fieldService.sendBattleData({hash, type: 'count', value: count})
          this.fieldService.sendBattleData({hash, type: 'fighters', value: formatFightersForPlayers(fighters)})
          this.fieldService.sendBattleData({hash, type: 'statuses', value: statuses})
        }
      })
    }).unsubscribe();
  }

  ngOnDestroy() {
    let {hash} = this.counterService
    this.canPlayersView = false;
    this.fieldService.sendBattleData({hash, type: 'canPlayersView', value: false})
  }

  changeBattlefieldName(target) {
    this.counterService.name = target.value
    this.fieldService.sendBattleData({hash: this.counterService.hash, type: 'name', value: target.value})
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
    if(this.canPlayersView) {
      this.fieldService.sendBattleData({hash, type: 'fighters', value: this.counterService.formatFightersForPlayers(this.counterService.fighters)})
    }
  }

  resurrectFighter(id) {
    let { fighters, hash } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === id) {
        fighters[i].dead = '0'
        this.fieldService.sendBattleData({ hash, type: 'fighterChange', value: '0', id, fighterProperty: 'dead' })
        this.counterService.sort()
        i = fighters.length
      }
    }
  }

  removeFighter(id) {
    let { fighters, hash } = this.counterService
    for (let i = 0; i < fighters.length; i++) {
      if (fighters[i].id === id) {
        fighters.splice(i, 1)
        this.fieldService.sendBattleData({ hash, type: 'removeFighter', value: id })
        this.fieldService.deleteFighter(id).subscribe().unsubscribe()
        i = fighters.length
      }
    }
  }
}
