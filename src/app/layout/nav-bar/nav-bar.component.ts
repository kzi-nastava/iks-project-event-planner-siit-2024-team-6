import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private router: Router, private authService: AuthService) {}
  
onProfileClick(): void {
  if(this.authService.isLoggedIn()){
    this.router.navigate(['profile'])
  } else{
    this.router.navigate(['login'])
  }
}

}
