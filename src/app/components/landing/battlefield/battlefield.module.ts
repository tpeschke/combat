import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { MatCardModule, MatButtonModule, MatTooltipModule, MatCheckboxModule } from '@angular/material';
import { CounterComponent } from './counter/counter.component';
import { RouterModule } from '@angular/router';
import { FightersectionComponent } from './fighter-section/fightersection.component';

@NgModule({
  declarations: [BattlefieldComponent, CounterComponent, FightersectionComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  exports: [
    BattlefieldComponent
  ]
})
export class BattlefieldModule { }
