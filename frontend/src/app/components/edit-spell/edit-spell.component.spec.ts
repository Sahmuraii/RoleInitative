import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpellComponent } from './edit-spell.component';

describe('EditSpellComponent', () => {
  let component: EditSpellComponent;
  let fixture: ComponentFixture<EditSpellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSpellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
