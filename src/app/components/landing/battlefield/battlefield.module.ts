import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { MatCardModule, MatButtonModule, MatTooltipModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { CounterComponent } from './counter/counter.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { RouterModule } from '@angular/router';
import { FightersectionComponent } from './fighter-section/fightersection.component';
import { WeaponSelectComponent } from './utils/weapon-select/weapon-select.component';
import { SinglefighterComponent } from './fighter-section/singlefighter/singlefighter/singlefighter.component';
import { AddFighterComponent } from './utils/add-fighter/add-fighter.component';
import { AddStatusComponent } from './utils/add-status/add-status.component';
import { StatusesComponent } from './utils/statuses/statuses.component';

@NgModule({
  declarations: [BattlefieldComponent, CounterComponent, FightersectionComponent, WeaponSelectComponent, SinglefighterComponent, AddFighterComponent, AddStatusComponent, StatusesComponent],
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
    ColorPickerModule,
    MatExpansionModule
  ],
  exports: [
    BattlefieldComponent,
    StatusesComponent
  ],
  entryComponents: [WeaponSelectComponent]
})
export class BattlefieldModule { }
