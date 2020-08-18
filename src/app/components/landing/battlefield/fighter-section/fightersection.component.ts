import { Component, OnInit, Input } from '@angular/core';
import { CounterService } from 'src/app/utils/counter.service';

@Component({
  selector: 'app-fighter-section',
  templateUrl: './fightersection.component.html',
  styleUrls: ['./fightersection.component.css']
})
export class FightersectionComponent implements OnInit {
  @Input() type: string;

  constructor(
    public counterService: CounterService
  ) { }

  ngOnInit() { }
}
