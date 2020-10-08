import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedFieldsComponent } from './savedFields/saved-fields.component';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatExpansionModule, MatCheckboxModule } from '@angular/material';
import { DeleteComponent } from './delete/delete.component';

@NgModule({
  declarations: [
    SavedFieldsComponent,
    DeleteComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatInputModule
  ],
  exports: [
    SavedFieldsComponent
  ],
  entryComponents: [DeleteComponent]
})
export class SavedFieldsModule { }
