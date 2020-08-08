import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/player/landing/landing.component';
import { PlayerViewComponent } from './components/landing/player/playerView/player-view.component';
import { SavedFieldsComponent } from './components/landing/savedFields/savedFields/saved-fields.component';
import { FieldResolverService } from './utils/resolvers/field-resolver.service'
import { BattlefieldComponent } from './components/landing/battlefield/battlefield/battlefield.component';
import { FighterResolverService } from './utils/resolvers/fighter-resolver.service';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: "full" },
  { path: 'fields', component: SavedFieldsComponent, resolve: { fields: FieldResolverService } },
  { path: 'battle/:hash', component: BattlefieldComponent, resolve: { battle: FighterResolverService } },
  { path: ':hash', component: PlayerViewComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }