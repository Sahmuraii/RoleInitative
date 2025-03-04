import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('HomeComponent - Search Bar', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, FormsModule, RouterTestingModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter characters based on search input', () => {
    component.char_data = [
      { character_id: 1, character_name: 'Aragorn', owner_name: 'Player1' },
      { character_id: 2, character_name: 'Legolas', owner_name: 'Player2' }
    ];

    fixture.detectChanges();

    console.log('Before Filtering:', component.filteredCharacters);

    component.searchTerm = 'Aragorn';
    component.filterCharacters();
    fixture.detectChanges();

    console.log('After Filtering:', component.filteredCharacters);

    expect(component.filteredCharacters.length).toBe(1);
    expect(component.filteredCharacters[0]).toEqual(
      { character_id: 1, character_name: 'Aragorn', owner_name: 'Player1' }
    );
  });
});

describe('HomeComponent - Character Cards', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule, FormsModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should display character cards', () => {
    component.char_data = [
      {
        character_id: 1,
        character_name: 'Aragorn',
        owner_name: 'Player1',
        race: 'Human',
        highest_class: 'Ranger',
        total_level: 5
      }
    ];

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const characterCards = fixture.debugElement.queryAll(By.css('.character-card'));
      expect(characterCards.length).toBe(1);

      const nameElement = characterCards[0].query(By.css('h3'));
      expect(nameElement).toBeTruthy();
      expect(nameElement.nativeElement.textContent).toContain('Aragorn');
    });
  });
});
