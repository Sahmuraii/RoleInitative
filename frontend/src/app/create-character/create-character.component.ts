import { CommonModule } from '@angular/common';

import { Component, inject, signal, OnInit, Signal, computed, WritableSignal, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Form, FormArray, Validators } from '@angular/forms';
import { CreateCharacterService } from '../services/create-character.service';
import { DND_Class } from '../models/dnd_class.type';
import { DND_Race } from '../models/dnd_race.type';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.css'
})
export class CreateCharacterComponent implements OnInit {
  characterForm: FormGroup; // Changed Initalization of form group

  dndClassesSignal = signal<Array<DND_Class>>([])
  dndRaces = signal<Array<DND_Race>>([])

  totalLevel = signal(0);
  primaryClass = signal(null)

  hideBasicInfo = false;
  hideRace = true;
  hideClass = true;
  hideClassProficiencies = true;
  hideAttributes = true;
  hideDetails = true;
  hideEquipment = true;

  createCharacterService = inject(CreateCharacterService)

  // Cosntructor changed to initalized formGroup
  constructor(private fb: FormBuilder) {
    // Initialize the form with a FormArray for class levels
    this.characterForm = this.fb.group({
      classLevels: this.fb.array([]) // FormArray to store class levels
    });
  }

  get classLevels(): FormArray {
    return this.characterForm.get('classLevels') as FormArray;
  }

  initializeClassLevels(classes: DND_Class[]): void {
    classes.forEach(() => {
      this.classLevels.push(this.fb.control(0, [Validators.min(0), Validators.max(20)]));
    });
  }

  getClassLevels(): { class_name: string, level: number }[] {
    return this.dndClassesSignal().map((dndClass, index) => ({
      class_name: dndClass.name,
      level: this.classLevels.at(index).value ?? 0
    }));
  }

  ngOnInit(): void {
    this.createCharacterService.getClassData().subscribe((classes) => {
      this.dndClassesSignal.set(classes)
      this.initializeClassLevels(classes); // Initialize the FormArray with class levels
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