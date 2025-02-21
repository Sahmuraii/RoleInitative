import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SpellService } from '../../services/spell.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-spell',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-spell.component.html',
  styleUrls: ['./create-spell.component.css']
})
export class CreateSpellComponent implements OnInit {
  spellForm: FormGroup;
  currentUserID: number | null = null;

  spellSchools = [
    'Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation',
    'Illusion', 'Necromancy', 'Transmutation'
  ];

  spellLevels = [
    'Cantrip', '1st-level', '2nd-level', '3rd-level', '4th-level',
    '5th-level', '6th-level', '7th-level', '8th-level', '9th-level'
  ];

  spellComponents = ['V', 'S', 'M'];

  spellRituals = ['Yes', 'No'];

  spellCastingTimes = [
    'Action', 'Bonus Action', 'Reaction', 'Minute', 'Hour', 'No Action', 'Special'
  ];

  spellRange = ['Self', 'Touch', 'Ranged', 'Sight', 'Unlimited'];

  DurationType = ['Instantaneous', 'Concentration', 'Time', 'Special', 'Until Dispelled', 'Until Dispelled or Triggered'];

  constructor(
    private fb: FormBuilder,
    private spellService: SpellService,
    private router: Router,
    private authService: AuthService
  ) {
    this.spellForm = this.fb.group({
      name: [''],
      version: [''],
      level: [''],
      school: [''],
      castingTime: [''],
      reactionDescription: [''],
      components: this.fb.array([]),
      materialsDescription: [''],
      spellRangeType: [''],
      range: [''],
      durationType: [''],
      duration: [''],
      durationTime: [''],
      description: [''],
      ritualSpell: [''],
      higherLevelDescription: [''],
      HigherLevelScaling: [''],
      classes: this.fb.array([]),
      subclasses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current User:', currentUser); // Debugging
    if (currentUser && currentUser.id != null) {
      this.currentUserID = currentUser.id;
      console.log('User ID:', this.currentUserID); // Debugging
    } else {
      console.error('No user is logged in for Spells.');
      this.router.navigate(['/login']);
    }
  }

  get components(): FormArray {
    return this.spellForm.get('components') as FormArray;
  }

  get classes(): FormArray {
    return this.spellForm.get('classes') as FormArray;
  }

  get subclasses(): FormArray {
    return this.spellForm.get('subclasses') as FormArray;
  }

  addComponent(): void {
    this.components.push(new FormControl(''));
  }

  removeComponent(index: number): void {
    this.components.removeAt(index);
  }

  addClass(): void {
    this.classes.push(new FormControl(''));
  }

  removeClass(index: number): void {
    this.classes.removeAt(index);
  }

  addSubclass(): void {
    this.subclasses.push(new FormControl(''));
  }

  removeSubclass(index: number): void {
    this.subclasses.removeAt(index);
  }

  onSubmit(): void {
    if (this.spellForm.invalid || !this.currentUserID) {
      alert('Please fill out all required fields and ensure you are logged in.');
      return;
    }

    const spellData = {
      ...this.spellForm.value,
      creatorID: this.currentUserID,
      components: this.components.value,
      classes: this.classes.value,
      subclasses: this.subclasses.value
    };

    this.spellService.createSpell(spellData).subscribe({
      next: (response) => {
        alert('Spell created successfully!');
        this.router.navigate(['/spells']);
      },
      error: (error) => {
        console.error('Error creating spell:', error);
        alert('Failed to create spell. Please try again.');
      }
    });
  }
}