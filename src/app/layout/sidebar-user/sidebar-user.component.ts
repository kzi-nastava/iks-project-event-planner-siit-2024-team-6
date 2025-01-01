import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.css'
})
export class SidebarUserComponent {
  isOpen: boolean = false;
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  };
  closeSidebar(): void {
    this.isOpen = false;
  };
}
