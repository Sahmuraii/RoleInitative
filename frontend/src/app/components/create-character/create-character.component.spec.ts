import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCharacterComponent } from './create-character.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateCharacterService } from '../../services/create-character.service';
import { Class_Proficiency_Option } from '../../models/class_proficiency_option.type';

describe('CreateCharacterComponent', () => {
  let component: CreateCharacterComponent;
  let fixture: ComponentFixture<CreateCharacterComponent>;
  let createCharacterService: CreateCharacterService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateCharacterComponent, 
        HttpClientTestingModule
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(CreateCharacterComponent);
    component = fixture.componentInstance;
    createCharacterService = TestBed.inject(CreateCharacterService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialize the form', () => {
    expect(component.characterForm).toBeDefined();
    expect(component.characterForm.get('classLevels')).toBeDefined();
    expect(component.characterForm.get('primaryClass')).toBeDefined();
    expect(component.characterForm.get('classProficiencies')).toBeDefined();
  })

  it('Should return the right class proficiency sets', () => {
    expect(component.getArrayOfProfTypes("1").length).toBe(1) //get barbarian proficiency
  })
});
