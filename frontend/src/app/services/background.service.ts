import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root' 
})
export class BackgroundService {

  constructor(private http: HttpClient) { }

  // Get all backgrounds from the backend
  getBackgrounds(): Observable<any> {
    return this.http.get(API_URL);
  }

  // Create a new background
  createBackground(background: any): Observable<any> {
    return this.http.post(API_URL, background);
  }

  // Update an existing background (if needed)
  updateBackground(id: string, background: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, background);
  }

  // Delete a background (if needed)
  deleteBackground(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}