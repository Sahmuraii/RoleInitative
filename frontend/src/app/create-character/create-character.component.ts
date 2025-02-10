import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.css'
})
export class CreateCharacterComponent {
  characterForm = new FormGroup({

  })
  hideBasicInfo = false;
  hideRace = true;
  hideClass = true;
  hideClassProficiencies = true;
  hideAttributes = true;
  hideDetails = true;
  hideEquipment = true;



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
