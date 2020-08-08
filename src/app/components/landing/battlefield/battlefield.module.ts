import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { MatCardModule, MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [BattlefieldComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    BattlefieldComponent
  ]
})
export class BattlefieldModule { }
