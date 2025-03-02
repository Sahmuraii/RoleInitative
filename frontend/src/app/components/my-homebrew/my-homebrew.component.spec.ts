import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHomebrewComponent } from './my-homebrew.component';

describe('MyHomebrewComponent', () => {
  let component: MyHomebrewComponent;
  let fixture: ComponentFixture<MyHomebrewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyHomebrewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyHomebrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
