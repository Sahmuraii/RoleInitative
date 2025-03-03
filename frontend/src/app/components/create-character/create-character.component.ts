import { CommonModule } from '@angular/common';

import { Component, inject, QueryList, signal, ViewChild, ViewChildren, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CreateCharacterService } from '../../services/create-character.service';
import { catchError, lastValueFrom, max } from 'rxjs';
import { DND_Class } from '../../models/dnd_class.type';
import { DND_Race } from '../../models/dnd_race.type';
import { Class_Proficiency_Option } from '../../models/class_proficiency_option.type';
import { Proficiency } from '../../models/proficiency.type';
import { sourceMapsEnabled } from 'node:process';

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
  selectionValue: number = 0


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
      //Basic Info form elements
      name: this.fb.control(null),
      ruleset: this.fb.control("2014"),
      levelMethod: this.fb.control("experience"),
      encumberance: this.fb.control("false"),

      //Race selection form elements
      race: this.fb.control(null),

      //class selection form elements
      classLevels: this.fb.array([]), // FormArray to store class levels
      primaryClass: this.fb.control("None"),

      //class proficiency form elements
      classProficiencies: this.fb.array([]),

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

      //Character details form elements
      background: this.fb.control(""),
      alignment: this.fb.control(""),
      personality: this.fb.control(""),
      faith: this.fb.control(""),
      height: this.fb.control(""),
      weight: this.fb.control(""),
      skinColor: this.fb.control(""),
      hairColor: this.fb.control(""),
      eyeColor: this.fb.control(""),
      age: this.fb.control(""),
      appearance: this.fb.control(""),
      backstory: this.fb.control(""),
      bonds: this.fb.control(""),
      miscDetails: this.fb.control(""),

      //Equipment details form elements, subject to change
      equipment: this.fb.control("")
      
    });
  }

  //Getters and setters
  get name(): string {
    return this.characterForm.get('name')?.value;
  }

  get ruleset(): string {
    return this.characterForm.get('ruleset')?.value;
  }

  get levelMethod(): string {
    return this.characterForm.get('levelMethod')?.value;
  }

  get encumberance(): string {
    return this.characterForm.get('encumberance')?.value;
  }

  get race(): number {
    return this.characterForm.get('race')?.value;
  }

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

  set str(num: number) {
    this.characterForm.get("str")?.setValue(num)
  }

  set dex(num: number) {
    this.characterForm.get('dex')?.setValue(num)
  }

  set con (num: number) {
    this.characterForm.get('con')?.setValue(num)
  }

  set int(num: number) {
    this.characterForm.get('int')?.setValue(num)
  }

  set wis(num: number){
    this.characterForm.get('wis')?.setValue(num)
  }

  set cha(num: number) {
    this.characterForm.get('cha')?.setValue(num)
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

  getClassString() {
    let levelArray = this.getClassLevels()
    let finalString = ""
    let nonPrimaryClassString = ""
    let numOfClasses = 0
    for(let dndClass of levelArray) {
      if(dndClass.level > 0) {
        numOfClasses++;
      }
    }
    if(this.primaryClass != "None") {
      for(let dndClass of levelArray) { //initial search for primary class
        if(dndClass.class_id.toString() == this.primaryClass) {
          finalString += `${this.dndClassesSignal()[dndClass.class_id-1].name} Lvl. ${dndClass.level}`
        } else if(dndClass.level > 0) {
          nonPrimaryClassString += `, ${this.dndClassesSignal()[dndClass.class_id-1].name} Lvl. ${dndClass.level}`
        }
      } 
    } else {
      for(let dndClass of levelArray) { //initial search for primary class
        if(dndClass.level > 0) {
          nonPrimaryClassString += `${this.dndClassesSignal()[dndClass.class_id-1].name} Lvl. ${dndClass.level}${numOfClasses > 1 ? ", " : ""}`
          numOfClasses--;
        }
      }
    }
    return finalString + nonPrimaryClassString
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
    profTypes.forEach((profOption, upperIndex) => {
      result.push([])
      profOption.proficiency_options.forEach((option, index) => {
        result[upperIndex].push(option)
      })
    })
    return result
  }

  getProfFirstOption(dndClass: string, index: number): number {
    let profTypes = this.getArrayOfProfTypes(dndClass)
    return profTypes[index].proficiency_options[0].id
  }

  initializeClassProficiencies(dndClass: string): void {
    this.classProficiencies.clear()
    this.getArrayOfProfTypes(dndClass).forEach((x, index) => {
      this.classProficiencies.push(this.fb.group({
        list_desc: x.list_description,
        selects: this.initializeProfOptions(x, index)
      }))

    })
    
  }

  initializeProfOptions(x: Class_Proficiency_Option, index: number) {
    let arr = new FormArray<FormGroup>([])
    for(let i = 0; i < x.max_choices; i++) {
      arr.push(this.fb.group({
        prof_list: new FormControl(x.proficiency_options),
        option: "None"
      }))
    }
    return arr
  }



  //Attribute methods
  showAttributeRuleset(rulesID: string) {
    this.str = 8;
    this.dex = 8;
    this.con = 8;
    this.int = 8;
    this.wis = 8;
    this.cha = 8;
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
    let maxStat = stat
    while(maxStat < 13 && points > 0) {
      maxStat++;
      points--;
    }
    while(maxStat < 15 && points >= 2) {
      maxStat++;
      points -= 2;
    }
    return maxStat
  }

  updateMaxStats(allStats: number[]) {
    let totalCost = 0
    for(let stat of allStats) {
      totalCost += this.pointBuyCostTable.get(stat) ?? 0;
    }
    this.spentPoints = totalCost
    for(let i = 0; i < 6; i++) {
      this.maxBuyStatArray[i] = this.getNewMaxBuyStat(allStats[i], (27-this.spentPoints))
    }
  }



  //Miscellaneous Methods
  calculateStatModifier(stat: number): string {
    let modifier = Math.floor((stat - 10) / 2)
    if(modifier >= 0) {
      return `+${modifier}`
    } else {
      return `${modifier}`
    }
  }

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