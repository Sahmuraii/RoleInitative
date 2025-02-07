import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { CapitalizePipe } from '../capitalize.pipe';

@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [CapitalizePipe, UpperCasePipe],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.css'
})
export class CharacterSheetComponent {

}
