import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBackgroundComponent } from './create-background.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BackgroundService } from '../../services/background.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('CreateBackgroundComponent', () => {
  let component: CreateBackgroundComponent;
  let fixture: ComponentFixture<CreateBackgroundComponent>;
  let backgroundService: BackgroundService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        CreateBackgroundComponent
      ],
      providers: [
        FormBuilder,
        {
          provide: BackgroundService,
          useValue: {
            createBackground: jasmine.createSpy('createBackground').and.returnValue(of({}))
          }
        },
        {
          provide: AuthService,
          useValue: {
            getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: 1 })
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBackgroundComponent);
    component = fixture.componentInstance;
    backgroundService = TestBed.inject(BackgroundService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.backgroundForm).toBeDefined();
    expect(component.backgroundForm.get('name')).toBeDefined();
    expect(component.backgroundForm.get('description')).toBeDefined();
    expect(component.backgroundForm.get('skillProficiencies')).toBeDefined();
    expect(component.backgroundForm.get('toolProficiencies')).toBeDefined();
    expect(component.backgroundForm.get('languageProficiencies')).toBeDefined();
    expect(component.backgroundForm.get('equipment')).toBeDefined();
    expect(component.backgroundForm.get('featureName')).toBeDefined();
    expect(component.backgroundForm.get('featureDescription')).toBeDefined();
    expect(component.backgroundForm.get('personalityTraits')).toBeDefined();
    expect(component.backgroundForm.get('ideals')).toBeDefined();
    expect(component.backgroundForm.get('bonds')).toBeDefined();
    expect(component.backgroundForm.get('flaws')).toBeDefined();
  });

  it('should add proficiencies to the form', () => {
    component.addProficiency('skill', 'Athletics');
    expect(component.skillProficienciesArray.length).toBe(1);
    expect(component.skillProficienciesArray.at(0).value).toBe('Athletics');

    component.addProficiency('tool', 'Navigator\'s Tools');
    expect(component.toolProficienciesArray.length).toBe(1);
    expect(component.toolProficienciesArray.at(0).value).toBe('Navigator\'s Tools');

    component.addProficiency('language', 'Elvish');
    expect(component.languageProficienciesArray.length).toBe(1);
    expect(component.languageProficienciesArray.at(0).value).toBe('Elvish');
  });

  it('should add equipment to the form', () => {
    component.addEquipment('Cutlass');
    expect(component.equipmentArray.length).toBe(1);
    expect(component.equipmentArray.at(0).value).toBe('Cutlass');
  });

  it('should submit the form with user_id', () => {
    component.backgroundForm.patchValue({
      name: 'Custom Pirate',
      description: 'A swashbuckling adventurer of the high seas.',
      featureName: 'Ship\'s Passage',
      featureDescription: 'You can secure free passage on a ship for you and your companions.'
    });

    component.addProficiency('skill', 'Athletics');
    component.addProficiency('tool', 'Navigator\'s Tools');
    component.addProficiency('language', 'Elvish');
    component.addEquipment('Cutlass');

    component.onSubmit();

    const expectedFormData = {
      name: 'Custom Pirate',
      description: 'A swashbuckling adventurer of the high seas.',
      skillProficiencies: ['Athletics'],
      toolProficiencies: ['Navigator\'s Tools'],
      languageProficiencies: ['Elvish'],
      equipment: ['Cutlass'],
      featureName: 'Ship\'s Passage',
      featureDescription: 'You can secure free passage on a ship for you and your companions.',
      personalityTraits: Array(8).fill(''),
      ideals: Array(6).fill(''),
      bonds: Array(6).fill(''),
      flaws: Array(6).fill(''),
      user_id: 1
    };

    expect(backgroundService.createBackground).toHaveBeenCalledWith(expectedFormData);
    expect(router.navigate).toHaveBeenCalledWith(['/create_background']);
  });

  it('should handle form submission error', () => {
    (backgroundService.createBackground as jasmine.Spy).and.returnValue(throwError('Error'));

    component.backgroundForm.patchValue({
      name: 'Custom Pirate',
      description: 'A swashbuckling adventurer of the high seas.',
      featureName: 'Ship\'s Passage',
      featureDescription: 'You can secure free passage on a ship for you and your companions.'
    });

    component.onSubmit();

    expect(backgroundService.createBackground).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if no user is logged in', () => {
    (authService.getCurrentUser as jasmine.Spy).and.returnValue(null);

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});