import { CommonModule } from '@angular/common';

import { Component, inject, QueryList, signal, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateCharacterService } from '../../services/create-character.service';
import { catchError } from 'rxjs';
import { DND_Class } from '../../models/dnd_class.type';
import { DND_Race } from '../../models/dnd_race.type';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.css'
})
export class CreateCharacterComponent implements OnInit {
  characterForm = new FormGroup({

  })
  dndClasses = signal<Array<DND_Class>>([])
  dndRaces = signal<Array<DND_Race>>([])


  hideBasicInfo = false;
  hideRace = true;
  hideClass = true;
  hideClassProficiencies = true;
  hideAttributes = true;
  hideDetails = true;
  hideEquipment = true;
  createCharacterService = inject(CreateCharacterService)

  ngOnInit(): void {
    this.createCharacterService.getClassData().subscribe((classes) => {
      this.dndClasses.set(classes)
    })
    this.createCharacterService.getRaceData().subscribe((races) => {
      this.dndRaces.set(races)
    })
  }

  
  

  public showTab(tabId: string) {
    switch(tabId) {
      case "basicInfo": {
        this.hideBasicInfo = false;
        this.hideRace = true;
        this.hideClass = true;
        this.hideClassProficiencies = true;
        this.hideAttributes = true;
        this.hideDetails = true;
        this.hideEquipment = true;
        break;
      }
      case "race": {
        this.hideBasicInfo = true;
        this.hideRace = false;
        this.hideClass = true;
        this.hideClassProficiencies = true;
        this.hideAttributes = true;
        this.hideDetails = true;
        this.hideEquipment = true;
        break; 
      }
      case "class": {
        this.hideBasicInfo = true;
        this.hideRace = true;
        this.hideClass = false;
        this.hideClassProficiencies = true;
        this.hideAttributes = true;
        this.hideDetails = true;
        this.hideEquipment = true;
        break;
      }
      case "class_proficiencies": {
        this.hideBasicInfo = true;
        this.hideRace = true;
        this.hideClass = true;
        this.hideClassProficiencies = false;
        this.hideAttributes = true;
        this.hideDetails = true;
        this.hideEquipment = true;
        break;
      }
      case "attributes": {
        this.hideBasicInfo = true;
        this.hideRace = true;
        this.hideClass = true;
        this.hideClassProficiencies = true;
        this.hideAttributes = false;
        this.hideDetails = true;
        this.hideEquipment = true;
        break;
      }
      case "details": {
        this.hideBasicInfo = true;
        this.hideRace = true;
        this.hideClass = true;
        this.hideClassProficiencies = true;
        this.hideAttributes = true;
        this.hideDetails = false;
        this.hideEquipment = true;
        break;
      }
      case "equipment": {
        this.hideBasicInfo = true;
        this.hideRace = true;
        this.hideClass = true;
        this.hideClassProficiencies = true;
        this.hideAttributes = true;
        this.hideDetails = true;
        this.hideEquipment = false;
        break;
      }
    }
    
  }
}
