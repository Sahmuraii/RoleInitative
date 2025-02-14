import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { API_URL } from '../constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  // Check if the code is running in a browser environment
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (this.isBrowser()) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        throw error;
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const userData = { username, email, password };
    return this.http.post(`${API_URL}/register`, userData).pipe(
      tap((response: any) => {
        if (this.isBrowser()) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      }),
      catchError((error) => {
        console.error('Registration failed', error);
        throw error;
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem('currentUser');
  }

  getCurrentUser(): any {
    if (this.isBrowser()) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${API_URL}/user/${id}`, userData).pipe(
      tap((response: any) => {
        if (this.isBrowser()) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      }),
      catchError((error) => {
        console.error('Update failed', error);
        throw error;
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/user/${id}`).pipe(
      tap(() => {
        if (this.isBrowser()) {
          localStorage.removeItem('currentUser');
        }
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Deletion failed', error);
        throw error;
      })
    );
  }
}