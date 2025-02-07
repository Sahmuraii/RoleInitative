import { Routes } from '@angular/router';
import { CreateBackgroundComponent } from './create-background/create-background.component';
import { HomeComponent } from './home/home.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';
// Auth Components
import { AuthInactiveComponent } from './auth/inactive/auth-inactive.component';
import { AuthLoginComponent } from './auth/login/auth-login.component';
import { AuthRegisterComponent } from './auth/register/auth-register.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'create/background', component: CreateBackgroundComponent },
  { path: 'character-sheet', component: CharacterSheetComponent},
  // Auth Components
  { path: 'auth-inactive', component: AuthInactiveComponent},
  { path: 'auth-login', component: AuthLoginComponent},
  { path: 'auth-register', component: AuthRegisterComponent},

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
