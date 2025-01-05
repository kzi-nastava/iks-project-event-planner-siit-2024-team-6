import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-provider',
  templateUrl: './sidebar-provider.component.html',
  styleUrl: './sidebar-provider.component.css'
})
export class SidebarProviderComponent {
  isOpen: boolean = false;
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  };
  closeSidebar(): void {
    this.isOpen = false;
  };
}
