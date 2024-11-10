import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  password: string;
  created_on: any;
  is_admin: boolean;
  is_confirmed: boolean;
  confirmed_on: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileApiService {
  profileUrl = 'assets/user-profile.json';
  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<UserProfile>('http://localhost:5000/profile/test');
  }
}
