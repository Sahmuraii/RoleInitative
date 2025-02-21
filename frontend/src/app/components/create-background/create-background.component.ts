import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BackgroundService } from '../../services/background.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-background',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-background.component.html',
  styleUrls: ['./create-background.component.css']
})
export class CreateBackgroundComponent {
  backgroundForm: FormGroup;
  currentUserID: number | null = null;

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
    private router: Router,
    private AuthService: AuthService
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

  ngOnInit(): void {
    const currentUser = this.AuthService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.currentUserID = currentUser.id; 
    } else {
      console.error('No user is logged in.');
      alert('You must be logged in to create a background.');
      this.router.navigate(['/login']); 
    }
  }

  get skillProficienciesArray() {
    return this.backgroundForm.get('skillProficiencies') as FormArray;
  }

  get toolProficienciesArray() {
    return this.backgroundForm.get('toolProficiencies') as FormArray;
  }

  get languageProficienciesArray() {
    return this.backgroundForm.get('languageProficiencies') as FormArray;
  }

  get equipmentArray() {
    return this.backgroundForm.get('equipment') as FormArray;
  }

  get personalityTraitsArray() {
    return this.backgroundForm.get('personalityTraits') as FormArray;
  }

  get idealsArray() {
    return this.backgroundForm.get('ideals') as FormArray;
  }

  get bondsArray() {
    return this.backgroundForm.get('bonds') as FormArray;
  }

  get flawsArray() {
    return this.backgroundForm.get('flaws') as FormArray;
  }

  addProficiency(type: string, value: string) {
    const control = new FormControl(value);
    if (type === 'skill') {
      this.skillProficienciesArray.push(control);
      this.skillProficiencies = this.skillProficiencies.filter(item => item !== value);
    } else if (type === 'tool') {
      this.toolProficienciesArray.push(control);
      this.toolProficiencies = this.toolProficiencies.filter(item => item !== value);
    } else if (type === 'language') {
      this.languageProficienciesArray.push(control);
      this.languageProficiencies = this.languageProficiencies.filter(item => item !== value);
    }
  }

  addEquipment(value: string) {
    const control = new FormControl(value);
    this.equipmentArray.push(control);
  }

  onSubmit() {
    const formData = this.backgroundForm.value;
    console.log('Form Data:', formData); 
    formData.user_id = this.currentUserID;
    this.backgroundService.createBackground(formData).subscribe(
      response => {
        console.log('Background created successfully!', response);
        alert('Background saved!');
        this.router.navigate(['/create_background']);
      },
      error => {
        console.error('Error creating background:', error);
        alert('Error saving background.');
      }
    );
  }
}