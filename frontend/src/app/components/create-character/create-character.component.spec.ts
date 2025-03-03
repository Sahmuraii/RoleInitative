import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCharacterComponent } from './create-character.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateCharacterService } from '../../services/create-character.service';
import { Class_Proficiency_Option } from '../../models/class_proficiency_option.type';

describe('CreateCharacterComponent', () => {
  let component: CreateCharacterComponent;
  let fixture: ComponentFixture<CreateCharacterComponent>;
  let createCharacterService: CreateCharacterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateCharacterComponent,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCharacterComponent);
    component = fixture.componentInstance;
    createCharacterService = TestBed.inject(CreateCharacterService);

    // Mock the classProficiencyOptions method to return only the Barbarian data
    component.classProficiencyOptions.set([
      {
        class_id: 1,
        description: "A fierce warrior of primitive background who can enter a battle rage",
        given_by_class: 1,
        given_when_multiclass: false,
        hit_die: 12,
        is_official: true,
        list_description: "Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival",
        max_choices: 2,
        name: "Barbarian",
        proficiency_list_id: 1,
        proficiency_options: [
          { id: 86, name: "Skill: Animal Handling", type: 1 },
          { id: 88, name: "Skill: Athletics", type: 1 },
          { id: 92, name: "Skill: Intimidation", type: 1 },
          { id: 95, name: "Skill: Nature", type: 1 },
          { id: 96, name: "Skill: Perception", type: 1 },
          { id: 102, name: "Skill: Survival", type: 1 },
        ],
      },
    ]);

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
  });

  it('Should return the right class proficiency sets for Barbarian (class_id = 1)', () => {
    const result = component.getArrayOfProfTypes("1");
    console.log("Result:", result); // Inspect the result
    expect(result.length).toBe(1); // Expect 1 object for Barbarian
    expect(result[0].class_id).toBe(1); // Verify the class_id
    expect(result[0].name).toBe("Barbarian"); // Verify the name
  });
});