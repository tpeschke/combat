import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { MatCardModule, MatButtonModule, MatTooltipModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { CounterComponent } from './counter/counter.component';
import { RouterModule } from '@angular/router';
import { FightersectionComponent } from './fighter-section/fightersection.component';
import { WeaponSelectComponent } from './utils/weapon-select/weapon-select.component';

@NgModule({
  declarations: [BattlefieldComponent, CounterComponent, FightersectionComponent, WeaponSelectComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ],
  exports: [
    BattlefieldComponent
  ],
  entryComponents: [WeaponSelectComponent]
})
export class BattlefieldModule { }
