import { Routes } from '@angular/router';
import { CreateBackgroundComponent } from './create-background/create-background.component';
import { HomeComponent } from './home/home.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { InactiveComponent } from './inactive/inactive.component';
import { CreateCharacterComponent } from './create-character/create-character.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'create/background', component: CreateBackgroundComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'inactive', component: InactiveComponent },
  { path: 'create/character', component: CreateCharacterComponent},
  //{ path: 'create/spell', component: CreateSpellComponent },
  { path: 'character-sheet', component: CharacterSheetComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
