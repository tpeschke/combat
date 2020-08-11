import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {

  constructor(
    private counterService: CounterService,
    ) { }

    public timeId

  ngOnInit() {}

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
