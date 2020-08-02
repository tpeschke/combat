import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedFieldsComponent } from './savedFields/saved-fields/saved-fields.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    SavedFieldsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    SavedFieldsComponent
  ]
})
export class SavedFieldsModule { }
