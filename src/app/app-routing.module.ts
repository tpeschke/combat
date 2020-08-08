import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/player/landing/landing.component';
import { PlayerViewComponent } from './components/landing/player/playerView/player-view/player-view.component';
import { SavedFieldsComponent } from './components/landing/savedFields/savedFields/saved-fields/saved-fields.component';
import { FieldResolverService } from './utils/resolvers/field-resolver.service'

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: "full" },
  { path: 'player', component: PlayerViewComponent },
  { path: 'fields', component: SavedFieldsComponent, resolve: { fields: FieldResolverService } },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }