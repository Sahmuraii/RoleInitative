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

  skillProficiencies = ['Stealth', 'Survival', 'Athletics', 'Arcana'];
  toolProficiencies = ['Herbalism Kit', 'Thieves\' Tools', 'Smith\'s Tools'];
  languageProficiencies = ['Elvish', 'Dwarvish', 'Gnomish'];

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