import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {

  constructor(
    private counterService: CounterService
  ) { }

  ngOnInit() {
  }

}
