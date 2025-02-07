import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthInactiveComponent } from './auth-inactive.component';

describe('AuthInactiveComponent', () => {
  let component: AuthInactiveComponent;
  let fixture: ComponentFixture<AuthInactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthInactiveComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
