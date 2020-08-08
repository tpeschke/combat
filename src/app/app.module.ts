import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/player/landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { BattlefieldModule } from './components/landing/battlefield/battlefield.module';
import { SavedFieldsModule } from './components/landing/savedFields/saved-fields.module';
import { PlayerViewComponent } from './components/landing/player/playerView/player-view/player-view.component';
import { FieldService } from './utils/field.service';
import { GeneralService } from './utils/general.service';
import { HttpService } from './utils/http.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PlayerViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatCardModule,
    HttpClientModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    FormsModule,
    BrowserAnimationsModule,
    BattlefieldModule,
    SavedFieldsModule
  ],
  providers: [FieldService, GeneralService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
