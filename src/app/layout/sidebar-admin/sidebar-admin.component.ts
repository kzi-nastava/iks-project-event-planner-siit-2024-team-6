import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {
  isOpen: boolean = false;
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  };
  closeSidebar(): void {
    this.isOpen = false;
  };
}
