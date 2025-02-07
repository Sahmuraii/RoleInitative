import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BackgroundService } from '../services/background.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-background',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './create-background.component.html',
  styleUrls: ['./create-background.component.css']
})
export class CreateBackgroundComponent {
  backgroundForm: FormGroup;

  skillProficiencies = [
    'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 
    'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 
    'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 
    'Sleight of Hand', 'Stealth', 'Survival'
  ];
  toolProficiencies = [
    'Alchemist\'s Supplies', 'Brewer\'s Supplies', 'Calligrapher\'s Supplies', 
    'Carpenter\'s Tools', 'Cartographer\'s Tools', 'Cobbler\'s Tools', 
    'Cook\'s Utensils', 'Glassblower\'s Tools', 'Herbalism Kit', 
    'Jeweler\'s Tools', 'Leatherworker\'s Tools', 'Mason\'s Tools', 
    'Painter\'s Supplies', 'Potter\'s Tools', 'Smith\'s Tools', 
    'Thieves\' Tools', 'Tinker\'s Tools', 'Weaver\'s Tools', 
    'Woodcarver\'s Tools', 'Disguise Kit', 'Forgery Kit', 
    'Navigator\'s Tools', 'Poisoner\'s Kit'
  ];
languageProficiencies = [
  'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 
  'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 
  'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
  ];

  constructor(
    private fb: FormBuilder,
    private backgroundService: BackgroundService,
    private router: Router
  ) {
    this.backgroundForm = this.fb.group({
      name: [''],
      description: [''],
      skillProficiencies: this.fb.array([]),
      toolProficiencies: this.fb.array([]),
      languageProficiencies: this.fb.array([]),
      equipment: this.fb.array([]),
      featureName: [''],
      featureDescription: [''],
      personalityTraits: this.fb.array(Array(8).fill(this.fb.control(''))),
      ideals: this.fb.array(Array(6).fill(this.fb.control(''))),
      bonds: this.fb.array(Array(6).fill(this.fb.control(''))),
      flaws: this.fb.array(Array(6).fill(this.fb.control('')))
    });
  }

  onSubmit() {
    const formData = this.backgroundForm.value;
    this.backgroundService.createBackground(formData).subscribe(
      response => {
        console.log('Background created successfully!', response);
        alert('Background saved!');
        this.router.navigate(['/create-background']);
      },
      error => {
        console.error('Error creating background:', error);
        alert('Error saving background.');
      }
    );
  }
}