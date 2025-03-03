import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatTooltipModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  passwordTooltip = 'Reveal Password';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordTooltip = this.showPassword ? 'Hide Password' : 'Reveal Password';
  }

  getPasswordVisibility() {
    return this.showPassword
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe((response: any) => {
        if (response) {
          this.router.navigate(['/home']); // Redirect to home after successful login
        } else {
          alert('Login failed. Please check your credentials.');
        }
      });
    }
  }
}
