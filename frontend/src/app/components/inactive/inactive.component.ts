import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inactive',
  templateUrl: './inactive.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./inactive.component.css']
})
export class InactiveComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  resendConfirmation() {
    this.authService.sendConfirmation().subscribe({
      next: () => alert('Confirmation email sent! Check your inbox.'),
      error: () => alert('Failed to resend confirmation email.')
    });
  }

  logout() {
    this.authService.logout();
  }
}
