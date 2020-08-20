import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';
import tooltips from '../../../../utils/tooltips'
@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {

  constructor(
    private counterService: CounterService,
  ) {
    this.tooltips = tooltips
  }

  public timeId
  public tooltips;

  ngOnInit() { }

  startAutoCount(interval) {
    clearInterval(this.timeId)
    this.timeId = setInterval(_ => {
      this.counterService.incrementCount()
    }, interval)
  }

  stopAutoCount() {
    clearInterval(this.timeId)
  }

}
