import { Component, OnInit, Input } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';
import { FieldService } from 'src/app/utils/field.service';
import tooltips from '../../../../../utils/tooltips'

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.css']
})
export class StatusesComponent implements OnInit {
  @Input() status: any;
  @Input() count: number;

  constructor(
    private counterService: CounterService,
    private fieldService: FieldService
  ) {
    this.tooltips = tooltips
  }

  private descriptionOpen = false
  public tooltips

  ngOnInit() { }

  toggleDescription() {
    this.descriptionOpen = !this.descriptionOpen
  }

  turnOffDescription() {
    this.descriptionOpen = false
  }

  deleteStatus(statusId) {
    let { statuses, hash } = this.counterService
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i].id === statusId) {
        statuses.splice(i, 1)
        this.fieldService.sendBattleData({ hash, type: 'removeStatus', value: statusId })
        this.fieldService.deleteStatus(statusId).subscribe().unsubscribe()
        i = statuses.length
      }
    }
  }

  showTime() {
    let {timestatus, interval} = this.status
      , {count} = this.counterService
    if (count - timestatus >= 0) {
      return (interval + ((timestatus - count + 1) % interval)) - 1
    } else {
      return (timestatus - count - 1) % interval
    }
  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

}
