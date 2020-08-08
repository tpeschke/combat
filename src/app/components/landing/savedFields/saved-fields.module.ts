import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedFieldsComponent } from './savedFields/saved-fields/saved-fields.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SavedFieldsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [
    SavedFieldsComponent
  ]
})
export class SavedFieldsModule { }
