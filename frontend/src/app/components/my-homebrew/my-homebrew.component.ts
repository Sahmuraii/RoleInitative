import { Component, Input, OnInit } from '@angular/core';
import { SpellService } from '../../services/spell.service';
import { BackgroundService } from '../../services/background.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf and *ngFor
import { Router } from '@angular/router'; // Import Router
 
@Component({
  selector: 'app-my-homebrew',
  standalone: true, // Ensure it's standalone
  imports: [CommonModule], // Import CommonModule for directives
  templateUrl: './my-homebrew.component.html',
  styleUrls: ['./my-homebrew.component.css']
})
export class MyHomebrewComponent implements OnInit {
  @Input() userId: number | null = null; // Define the input property
  spells: any[] = [];
  backgrounds: any[] = [];

  constructor(
    private spellService: SpellService,
    private backgroundService: BackgroundService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.fetchSpells();
      this.fetchBackgrounds();
    }
  }

  fetchSpells(): void {
    this.spellService.getSpellsByUser(this.userId!).subscribe({
      next: (spells) => {
        console.log('Spells fetched:', spells); // Log the fetched spells
        this.spells = spells;
      },
      error: (error) => {
        console.error('Error fetching spells:', error);
        console.error('Full error response:', error.error); // Log the full error response
        alert('Failed to fetch spells. Please check the console for details.');
      }
    });
  }

  fetchBackgrounds(): void {
    this.backgroundService.getBackgroundsByUser(this.userId!).subscribe({
      next: (backgrounds) => {
        console.log('Backgrounds fetched:', backgrounds); // Log the fetched backgrounds
        this.backgrounds = backgrounds;
      },
      error: (error) => {
        console.error('Error fetching backgrounds:', error);
        console.error('Full error response:', error.error); // Log the full error response
        alert('Failed to fetch backgrounds. Please check the console for details.');
      }
    });
  }

  navigateToEditSpells(spellId: number): void {
    this.router.navigate(['/edit-spell', spellId]); // Navigate to the edit route
  }

  navigateToEditBackground(backgroundId: number): void {
    this.router.navigate(['/edit-background', backgroundId]); // Navigate to the edit route
  }
}