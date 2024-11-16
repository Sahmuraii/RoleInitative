import { Component } from '@angular/core';
import { UserProfile, UserProfileApiService } from '../user-profile-api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userProfile: UserProfile | undefined;
  constructor(private profileService: UserProfileApiService) {}

  clear() {
    this.userProfile = undefined;
  }

  showProfile() {
    this.profileService.getProfile().subscribe({
      next: data => this.userProfile = { ...data }, // success path
    });
  }
}
