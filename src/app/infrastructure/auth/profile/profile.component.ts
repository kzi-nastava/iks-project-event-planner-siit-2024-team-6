import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {}; // User data
  updatedUser: any = {}; // Editable data
  updatedUserPhotos: any = {}
  newPhotoUrl: string = '';
  newCompanyPhotoUrl: string = '';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.initializePhotosUser();  //if photos are changed
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
  
  initializePhotosUser(): void{
    this.updatedUserPhotos = { 
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
    this.initializePhotosUser();
    if (this.newCompanyPhotoUrl && this.newCompanyPhotoUrl.trim()) {
      if (!this.updatedUserPhotos.companyPhotos) {
        this.updatedUserPhotos.companyPhotos = []; // Инициализируем массив, если его нет
      }
  
      this.updatedUserPhotos.companyPhotos.push(this.newCompanyPhotoUrl.trim());
      this.updatedUser.companyPhotos.push(this.newCompanyPhotoUrl.trim());
      console.log(this.user.companyPhotos);
      console.log('Photo added:', this.newCompanyPhotoUrl); // Проверка в консоли
      this.newCompanyPhotoUrl = ''; // Очищаем поле ввода
      this.submitPhoto();

    } else {
      console.warn('Photo URL is empty'); // Логируем пустой ввод
    }
  }

  removePhoto(index: number): void {
    console.log(index);
    this.initializePhotosUser();
    this.updatedUserPhotos.companyPhotos.splice(index, 1);
    this.updatedUser.companyPhotos.splice(index, 1);
    this.submitPhoto();
  }

updatePhotoSmall(): void {
  this.initializePhotosUser();
    if (this.newPhotoUrl.trim()) {
      this.updatedUserPhotos.photoUrl = this.newPhotoUrl.trim();
      this.updatedUser.photoUrl = this.newPhotoUrl.trim();
      console.log('Photo URL updated:', this.newPhotoUrl);
      this.newPhotoUrl = ''; // Очищаем поле
      this.submitPhoto();
    }
  }

  // Удаляем URL фото
  removePhotoSmall(): void {
    this.initializePhotosUser();
    this.updatedUserPhotos.photoUrl = null;
    this.updatedUser.photoUrl =null;
    console.log('Photo URL removed');
    this.submitPhoto();
  }

  submitPhoto(): void {
    // Send PUT request to update the user profile
    this.http.put('/api/users/profile', this.updatedUserPhotos).subscribe({
      next: () => {
        console.log('Profile photos updated successfully');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      },
    });
  }
  submitChanges(): void {
    // Send PUT request to update the user profile
    this.http.put('/api/users/profile', this.updatedUser).subscribe({
      next: () => {
        console.log('Profile updated successfully');
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000
        });
        this.loadUserProfile(); // Reload the profile
      },
      error: (error) => {
        const errorMessage = error.error || 'An unexpected error occurred.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000
        });
        console.error('Error updating profile:', error);
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
