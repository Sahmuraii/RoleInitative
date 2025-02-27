import { CommonModule } from '@angular/common';

import { Component, inject, QueryList, signal, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCharacterService } from '../../services/create-character.service';
import { catchError } from 'rxjs';
import { DND_Class } from '../../models/dnd_class.type';
import { DND_Race } from '../../models/dnd_race.type';
import { Class_Proficiency_Option } from '../../models/class_proficiency_option.type';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.css'
})
export class CreateCharacterComponent implements OnInit {
  characterForm: FormGroup; // Changed Initalization of form group
  createCharacterService = inject(CreateCharacterService)

  //Data Retrieved From Backend
  dndRaces = signal<Array<DND_Race>>([])
  dndClassesSignal = signal<Array<DND_Class>>([])
  classProficiencyOptions = signal<Array<Class_Proficiency_Option>>([])

  //Class Selection Variables
  minLevel = 0
  maxLevel: number[] = []
  totalLevelsDisplay = 0
  chosenClasses: number[] = []



  //Class Proficiency Variables


  hiddenArray = [false, true, true, true, true, true, true]
  // Cosntructor changed to initalized formGroup
  constructor(private fb: FormBuilder) {
    // Initialize the form with a FormArray for class levels
    this.characterForm = this.fb.group({
      classLevels: this.fb.array([]), // FormArray to store class levels
      primaryClass: this.fb.control("None"),
      classProficiencies: this.fb.array([]),
      profSelects: this.fb.array([])
    });
  }

  //Getters and setters
  get classLevels(): FormArray {
    return this.characterForm.get('classLevels') as FormArray;
  }

  get primaryClass(): string {
    return this.characterForm.get('primaryClass')?.value;
  }

  get classProficiencies(): FormArray {
    return this.characterForm.get('classProficiencies') as FormArray
  }
  
  set classProficiencies(newArray: []) {
    this.characterForm.setValue([])
  }

  //Class Selection Methods
  initializeClassLevels(classes: DND_Class[]): void {
    classes.forEach(() => {
      this.classLevels.push(this.fb.control(0, Validators.min(this.minLevel)));
    });
  }

  getClassLevels(): { class_id: number, level: number }[] {
    return this.dndClassesSignal().map((dndClass, index) => ({
      class_id: dndClass.class_id,
      level: this.classLevels.at(index).value ?? 0
    }));
  }

  updateMaxLevels() {
    let totalLevels = 0
    this.classLevels.controls.forEach(dndClass => {
      totalLevels += dndClass.value
    })
    this.totalLevelsDisplay = totalLevels
    for (let i in this.maxLevel) {
      this.maxLevel[i] = this.classLevels.at(parseInt(i)).value + (20 - totalLevels)
    }
    this.chosenClasses = []
    for(let dndClass of this.getClassLevels()) {
      if(dndClass.level != 0) {
        this.chosenClasses.push(dndClass.class_id)
      }
    }
  }

  //Class Proficiency Methods
  getArrayOfProfTypes(dndClass: string): Class_Proficiency_Option[] {
    let classNum = parseInt(dndClass)
    let result: Class_Proficiency_Option[] = []
    for(let classProf of this.classProficiencyOptions()) {
      if(classProf.class_id == classNum) {
        result.push(classProf)
      }
    }
    
    console.log(result.length)
    return result
  }

  initializeClassProficiencies(dndClass: string): void {
    this.classProficiencies.clear()
    this.getArrayOfProfTypes(dndClass).forEach(x => {
      this.classProficiencies.push(this.fb.group({
        list_desc: x.list_description,
        selects: this.initializeProfOptions(x)
      }))
    })
    
  }

  initializeProfOptions(x: Class_Proficiency_Option) {
    let arr = new FormArray<FormGroup>([])
    for(let i = 0; i < x.max_choices; i++) {
      arr.push(this.fb.group({
        prof_list: new FormControl(x.proficiency_options),
        option: null
      }))
    }
    return arr
  }


  //Miscellaneous Methods
  ngOnInit(): void {
    this.createCharacterService.getRaceData().subscribe((races) => {
      this.dndRaces.set(races)
    })
    this.createCharacterService.getClassData().subscribe((classes) => {
      this.dndClassesSignal.set(classes)
      this.initializeClassLevels(classes); // Initialize the FormArray with class levels
      this.dndClassesSignal().forEach(() => {
        this.maxLevel.push(20)
      })
    })
    this.createCharacterService.getClassProficiencyData().subscribe((options) => {
      this.classProficiencyOptions.set(options)

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