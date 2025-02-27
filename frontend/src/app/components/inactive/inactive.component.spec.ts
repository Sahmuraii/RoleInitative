import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveComponent } from './inactive.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InactiveComponent', () => {
  let component: InactiveComponent;
  let fixture: ComponentFixture<InactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveComponent, HttpClientTestingModule]
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
