import { Routes } from '@angular/router';
import { CreateBackgroundComponent } from './create-background/create-background.component'; 

export const routes: Routes = [
  { path: 'create-background', component: CreateBackgroundComponent },
  { path: '', redirectTo: '/create-background', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/create-background' } 
];