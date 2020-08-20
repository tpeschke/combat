import { Component, OnInit, Input } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.css']
})
export class StatusesComponent implements OnInit {
  @Input() status: any;

  constructor(
    private counterService: CounterService
  ) { }

  private descriptionOpen = false

  ngOnInit() {
  }

  toggleDescription() {
    this.descriptionOpen = !this.descriptionOpen
  }

  turnOffDescription() {
    this.descriptionOpen = false
  }

}
