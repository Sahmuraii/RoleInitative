import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { CapitalizePipe } from '../capitalize.pipe';
import { CommonModule } from '@angular/common';
import { NONE_TYPE } from '@angular/compiler';

@Component({
    selector: 'app-character-sheet',
    standalone: true,
    imports: [CommonModule, CapitalizePipe, UpperCasePipe],
    templateUrl: './character-sheet.component.html',
    styleUrl: './character-sheet.component.css'
})
export class CharacterSheetComponent {

    ngOnInit() {
    }

    // Check if char_si.proficiencies exists
    // If yes, then for every proficiency in char_si.proficiencies:
    //     If proficiency is a saving throw and it involves a provided "stat"
    //     Return true, otherwise if no match is found return false
    checkProficiency(stat: string): boolean {
        return this.char_si?.proficiencies?.some( (proficiency: any) =>
            proficiency.type_name?.toLowerCase().includes('saving-throw') &&
            proficiency.proficiency_name?.toLowerCase().includes(stat.toLowerCase())
        ) || false;
      }
}
