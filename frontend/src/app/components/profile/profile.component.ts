import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { MyHomebrewComponent } from '../my-homebrew/my-homebrew.component'; 

@Component({
  selector: 'app-profile',
  standalone: true, 
  imports: [CommonModule, MyHomebrewComponent], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  userId: number | null = null;
  selectedTab: string = 'overview';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') || '';
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
    }
  }
}