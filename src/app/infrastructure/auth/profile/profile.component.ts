import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {}; // User data
  updatedUser: any = {}; // Editable data

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.http.get('/api/users/profile').subscribe({
      next: (data: any) => {
        this.user = data;
        this.initializeEditableUser();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      },
    });
  }

  initializeEditableUser(): void {
    this.updatedUser = { 
      id: this.user.id,
      email: this.user.email,
      name: this.user.name || '',
      lastname: this.user.lastname || '',
      address: this.user.address || '',
      phoneNumber: this.user.phoneNumber || '',
      userType: this.user.userType,
      isActive: this.user.isActive,
      suspendedSince: this.user.suspendedSince,
      companyEmail: this.user.companyEmail,
      companyName: this.user.companyName,
      companyAddress: this.user.companyAddress || '',
      description: this.user.description || '',
      openingTime: this.user.openingTime || '',
      closingTime: this.user.closingTime || '',
    };
  }
  

  submitChanges(): void {
    // Send PUT request to update the user profile
    this.http.put('/api/users/profile', this.updatedUser).subscribe({
      next: () => {
        console.log('Profile updated successfully');
        this.loadUserProfile(); // Reload the profile
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      },
    });
  }
}
