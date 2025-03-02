import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        const user = this.authService.getCurrentUser();
        this.username = user?.username || '';
      } else {
        this.username = '';
      }
    });

    // Initialize the state
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.username = user?.username || '';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    if (this.username) {
      this.router.navigate(['/profile', this.username]); // Navigate to the profile page
    }
  }
}