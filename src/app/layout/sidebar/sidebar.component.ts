import { Component } from '@angular/core';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  role: string = '';
  isOpen: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.userState.subscribe((result) => {
      this.role = result;
    })
  }
  
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  };

  closeSidebar(): void {
    this.isOpen = false;
  };
}
