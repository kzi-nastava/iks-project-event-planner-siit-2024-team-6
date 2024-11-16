import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen: boolean = false;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  };

  closeSidebar(): void {
    this.isOpen = false;
  };
}
