import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {}; // User data
  updatedUser: any = {}; // Editable data
  newPhotoUrl: string = '';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

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
      photoUrl: this.user.photoUrl,
      suspendedSince: this.user.suspendedSince,
      companyEmail: this.user.companyEmail,
      companyName: this.user.companyName,
      companyAddress: this.user.companyAddress || '',
      description: this.user.description || '',
      openingTime: this.user.openingTime || '',
      closingTime: this.user.closingTime || '',
      companyPhotos: [...(this.user.companyPhotos || [])]
    };
  }

  addPhoto(): void {
    if (this.newPhotoUrl && this.newPhotoUrl.trim()) {
      if (!this.updatedUser.companyPhotos) {
        this.updatedUser.companyPhotos = []; // Инициализируем массив, если его нет
      }
  
      this.updatedUser.companyPhotos.push(this.newPhotoUrl.trim());
      console.log('Photo added:', this.newPhotoUrl); // Проверка в консоли
      this.newPhotoUrl = ''; // Очищаем поле ввода
    } else {
      console.warn('Photo URL is empty'); // Логируем пустой ввод
    }
  }

  removePhoto(index: number): void {
    this.updatedUser.companyPhotos.splice(index, 1);
  }

updatePhotoSmall(): void {
    if (this.newPhotoUrl.trim()) {
      this.updatedUser.photoUrl = this.newPhotoUrl.trim();
      console.log('Photo URL updated:', this.newPhotoUrl);
      this.newPhotoUrl = ''; // Очищаем поле
    }
  }

  // Удаляем URL фото
  removePhotoSmall(): void {
    this.updatedUser.photoUrl = null;
    console.log('Photo URL removed');
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
  changePassword(): void{
    this.router.navigate(['/change-password']);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  deactivate(): void {
    this.http.delete('/api/users/profile').subscribe({
      next: () => {
        console.log('[ProfileComponent] Account successfully deactivated.');
        this.logout(); // Logout после успешной деактивации
      },
      error: (err) => {
        if (err.status === 400) {
          alert('Cannot deactivate account: Active services or future events exist.');
        } else {
          console.error('[ProfileComponent] Error deactivating account:', err);
        }
      },
    });
  }
}
