import { Routes } from '@angular/router';
import { CreateBackgroundComponent } from './create-background/create-background.component'; 
import { HomeComponent } from './home/home.component';
import { CreateCharacterComponent } from './create-character/create-character.component';
//import { CharacterSheetComponent } from './character-sheet/character-sheet.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'create/background', component: CreateBackgroundComponent },
  { path: 'create/character', component: CreateCharacterComponent},
  //{ path: 'character-sheet', component: CharacterSheetComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/home' }
];