import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBackgroundComponent } from './edit-background.component';

describe('EditBackgroundComponent', () => {
  let component: EditBackgroundComponent;
  let fixture: ComponentFixture<EditBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBackgroundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
