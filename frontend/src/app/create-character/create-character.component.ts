import { CommonModule } from '@angular/common';

import { Component, inject, signal, OnInit, Signal, computed, WritableSignal, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Form, FormArray, Validators } from '@angular/forms';
import { CreateCharacterService } from '../services/create-character.service';
import { DND_Class } from '../models/dnd_class.type';
import { DND_Race } from '../models/dnd_race.type';
import { max } from 'rxjs';

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

  minLevel = 0
  maxLevel: number[] = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
  totalLevelsDisplay = 0

  hiddenArray = [false, true, true, true, true, true, true]

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
      this.classLevels.push(this.fb.control(0, Validators.min(0)));
    });
  }

  getClassLevels(): { class_name: string, level: number }[] {
    return this.dndClassesSignal().map((dndClass, index) => ({
      class_name: dndClass.name,
      level: this.classLevels.at(index).value ?? 0
    }));
  }

  updateMaxLevels() {
    let totalLevels = 0
    this.classLevels.controls.forEach(dndClass => {
      totalLevels += dndClass.value
    })
    this.totalLevelsDisplay = totalLevels
    for (var i in this.maxLevel) {
      this.maxLevel[i] = this.classLevels.at(parseInt(i)).value + (20 - totalLevels)
    }
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
        this.hiddenArray = [false, true, true, true, true, true, true]
        break;
      }
      case "race": {
        this.hiddenArray = [true, false, true, true, true, true, true]
        break; 
      }
      case "class": {
        this.hiddenArray = [true, true, false, true, true, true, true];
        break;
      }
      case "class_proficiencies": {
        this.hiddenArray = [true, true, true, false, true, true, true]
        break;
      }
      case "attributes": {
        this.hiddenArray = [true, true, true, true, false, true, true]
        break;
      }
      case "details": {
        this.hiddenArray = [true, true, true, true, true, false, true]
        break;
      }
      case "equipment": {
        this.hiddenArray = [true, true, true, true, true, true, false]
        break;
      }
    }
    
  }
}