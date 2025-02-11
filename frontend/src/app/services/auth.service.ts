import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { API_URL } from '../constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/login`, { email, password }).pipe(
      tap((response: any) => {
        // Store user data in local storage
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }),
      catchError((error) => {
        console.error('Login failed', error);
        throw error; // Rethrow the error for handling in the component
      })
    );
  }

  // Register a new user
  register(username: string, email: string, password: string): Observable<any> {
    const userData = { username, email, password };
    return this.http.post(`${API_URL}/register`, userData).pipe(
      tap((response: any) => {
        // Optionally store user data in local storage after registration
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }),
      catchError((error) => {
        console.error('Registration failed', error);
        throw error; // Rethrow the error for handling in the component
      })
    );
  }

  // Logout user
  logout(): void {
    // Remove user data from local storage
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  // Get the current user
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Update user profile (if needed)
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${API_URL}/user/${id}`, userData).pipe(
      tap((response: any) => {
        // Update local storage with new user data
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      }),
      catchError((error) => {
        console.error('Update failed', error);
        throw error; // Rethrow the error for handling in the component
      })
    );
  }

  // Delete user account (if needed)
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/user/${id}`).pipe(
      tap(() => {
        // Remove user data from local storage
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Deletion failed', error);
        throw error; // Rethrow the error for handling in the component
      })
    );
  }
}