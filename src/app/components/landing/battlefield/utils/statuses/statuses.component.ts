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

  ngOnInit() {
  }

  toggleDescription() {
    this.descriptionOpen = !this.descriptionOpen
  }

  turnOffDescription() {
    this.descriptionOpen = false
  }

  deleteStatus(statusId) {
    let { statuses, hash } = this.counterService
    for(let i = 0; i < statuses.length; i++) {
      if (statuses[i].id === statusId) {
        statuses.splice(i, 1)
        this.fieldService.sendBattleData({ hash, type: 'removeStatus', value: statusId })
        this.fieldService.deleteStatus(statusId).subscribe().unsubscribe()
        i = statuses.length
      }
    }
  }

}
