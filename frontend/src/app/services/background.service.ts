import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class BackgroundService {
  private apiUrl = 'http://127.0.0.1:5000/'; 

  constructor(private http: HttpClient) { }

  // Get all backgrounds from the backend
  getBackgrounds(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Create a new background
  createBackground(background: any): Observable<any> {
    return this.http.post(this.apiUrl, background);
  }

  // Update an existing background (if needed)
  updateBackground(id: string, background: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, background);
  }

  // Delete a background (if needed)
  deleteBackground(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}