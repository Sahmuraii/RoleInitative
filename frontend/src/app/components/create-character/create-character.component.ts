import { CommonModule } from '@angular/common';

import { Component, inject, QueryList, signal, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CreateCharacterService } from '../../services/create-character.service';
import { catchError, lastValueFrom } from 'rxjs';
import { DND_Class } from '../../models/dnd_class.type';
import { DND_Race } from '../../models/dnd_race.type';
import { Class_Proficiency_Option } from '../../models/class_proficiency_option.type';
import { Proficiency } from '../../models/proficiency.type';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
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



  //Attribute variables
  attrRulesHiddenArray = [false, true, true, true]
  rolledStats: number[] = []
  standardArray = [15, 14, 13, 12, 10, 8]
  pointBuyCostTable = new Map<number, number>([
    [8, 0],
    [9, 1],
    [10, 2],
    [11, 3],
    [12, 4],
    [13, 5],
    [14, 7],
    [15, 9],
  ]);
  spentPoints = 0
  maxBuyStatArray = [15, 15, 15, 15, 15, 15]

  

  hiddenArray = [false, true, true, true, true, true, true]
  // Cosntructor changed to initalized formGroup
  constructor(private fb: FormBuilder) {
    // Initialize the form with a FormArray for class levels
    this.characterForm = this.fb.group({
      //class selection form elements
      classLevels: this.fb.array([]), // FormArray to store class levels
      primaryClass: this.fb.control("None"),

      //class proficiency form elements
      classProficiencies: this.fb.array([]),
      profSelects: this.fb.array([]),

      //stat allocation form elements
      statRuleset: this.fb.control("roll"),
      rollDiceAmt: this.fb.control(4),
      rollDiceType: this.fb.control(6),
      rollDropAmt: this.fb.control(1),
      str: this.fb.control(8),
      dex: this.fb.control(8),
      con: this.fb.control(8),
      int: this.fb.control(8),
      wis: this.fb.control(8),
      cha: this.fb.control(8),
      
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

  get statRuleset(): string {
    return this.characterForm.get('statRuleset')?.value
  }

  get rollDiceAmt(): number {
    return this.characterForm.get('rollDiceAmt')?.value
  }

  get rollDiceType(): number {
    return this.characterForm.get('rollDiceType')?.value
  }

  get rollDropAmt(): number {
    return this.characterForm.get('rollDropAmt')?.value
  }

  get statArray(): FormArray {
    return this.characterForm.get('statArray') as FormArray
  }

  get str(): number {
    return this.characterForm.get('str')?.value
  }

  get dex(): number {
    return this.characterForm.get('dex')?.value
  }

  get con (): number {
    return this.characterForm.get('con')?.value
  }

  get int(): number {
    return this.characterForm.get('int')?.value
  }

  get wis(): number {
    return this.characterForm.get('wis')?.value
  }

  get cha(): number {
    return this.characterForm.get('cha')?.value
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
    return result
  }

  getArrayofProfOptions(dndClass: string): Proficiency[][] {
    let profTypes = this.getArrayOfProfTypes(dndClass)
    let result: Proficiency[][] = []
    profTypes.forEach((profOption, index) => {
      result.push([])
      profOption.proficiency_options.forEach((option) => {
        result[index].push(option)
      })
    })
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



  //Attribute methods
  showAttributeRuleset(rulesID: string) {
    switch(rulesID) {
      case "roll": {
        this.attrRulesHiddenArray = [false, true, true, true]
        break
      }
      case "standard_array": {
        this.attrRulesHiddenArray = [true, false, true, true]
        break
      }
      case "point_buy": {
        this.attrRulesHiddenArray = [true, true, false, true]
        break
      }
      case "manual": {
        this.attrRulesHiddenArray = [true, true, true, false]
        break
      }
    }
  }

  getRandomValueBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  rollStats() {
    let result: number[] = []
    
    for(let i = 0; i < 6; i++) {
      let randInts: number[] = []
      let total = 0
      for(let j = 0; j < 4; j++) {
        randInts.push(this.getRandomValueBetween(1, 6))
      }
      let indexOfLowest = randInts.indexOf(Math.min(...randInts))
      randInts.splice(indexOfLowest, 1)
      for(let num of randInts) {
        total += num
      }
      result.push(total)
    }
    this.rolledStats = result.sort(function (a, b) {  return a - b;  }).reverse()
    
  }

  getNewMaxBuyStat(stat: number, points: number) {
    if(points >= 9) {
      return 15
    } else if(points >= 7) {
      return 14
    } else if(points >= 5) {
      return 13
    } else if(points == 4) {
      return 12
    } else if(points == 3) {
      return 11
    } else if(points == 2) {
      return 10
    } else if(points == 1) {
      return 9
    } else {
      return 8
    }
  }
  updateMaxStats(allStats: number[]) {
    let totalCost = 0
    for(let stat of allStats) {
      totalCost += this.pointBuyCostTable.get(stat) ?? 0;
    }
    this.spentPoints = totalCost
    for(let i = 0; i < 6; i++) {

    }
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