import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpellComponent } from './create-spell.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateSpellComponent', () => {
  let component: CreateSpellComponent;
  let fixture: ComponentFixture<CreateSpellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpellComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
