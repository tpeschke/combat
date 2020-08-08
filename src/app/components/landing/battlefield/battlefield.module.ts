import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { MatCardModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { CounterComponent } from './counter/counter.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BattlefieldComponent, CounterComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [
    BattlefieldComponent
  ]
})
export class BattlefieldModule { }
