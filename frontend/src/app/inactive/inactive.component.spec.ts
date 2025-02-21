import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inactive } from './inactive.component';

describe('InactiveComponent', () => {
  let component: InactiveComponent;
  let fixture: ComponentFixture<InactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
