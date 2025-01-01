import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-organizer',
  templateUrl: './sidebar-organizer.component.html',
  styleUrl: './sidebar-organizer.component.css'
})
export class SidebarOrganizerComponent {
  isOpen: boolean = false;
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  };
  closeSidebar(): void {
    this.isOpen = false;
  };
}
