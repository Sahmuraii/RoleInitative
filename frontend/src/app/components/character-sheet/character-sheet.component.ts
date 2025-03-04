import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { CapitalizePipe } from '../../capitalize.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { API_URL } from '../../constants';
import { NONE_TYPE } from '@angular/compiler';

@Component({
    selector: 'app-character-sheet',
    standalone: true,
    imports: [CommonModule, CapitalizePipe, UpperCasePipe],
    templateUrl: './character-sheet.component.html',
    styleUrl: './character-sheet.component.css'
})
export class CharacterSheetComponent {
    
    Math: any;
    http = inject(HttpClient);
    char_data: any = {};

    constructor(
        private route: ActivatedRoute
    ) {
        this.Math = Math;
     }

    
    ngOnInit() {
        const char_id: string = this.route.snapshot.paramMap.get('char_id') || "";
        this.getCharacterData(char_id);
        console.log(this.char_data);
    }

    getCharacterData(char_id: string): any {
        this.http.get(`${API_URL}/character/${char_id}`).subscribe((res)=>{
            this.char_data = res;
            console.log(res);
            //return res;
        })
        //console.log(`${API_URL}/character/${char_id}`);
        //return this.http.get<{[key: string]: any}>(`${API_URL}/character/${char_id}`);
    }

    // Check if char_data.char_si.proficiencies exists
    // If yes, then for every proficiency in char_data.char_si.proficiencies:
    //     If proficiency is a saving throw and it involves a provided "stat"
    //     Return true, otherwise if no match is found return false
    checkProficiency(stat: string): boolean {
        if (!this.char_data.char_si || !this.char_data.char_si.proficiencies) {
            return false;
        }

        return this.char_data.char_si?.proficiencies?.some( (proficiency: any) =>
            proficiency.type_name?.toLowerCase().includes('saving-throw') &&
            proficiency.proficiency_name?.toLowerCase().includes(stat.toLowerCase())
        );
      }
}
