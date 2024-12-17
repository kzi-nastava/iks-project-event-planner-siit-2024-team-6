import { Component, ViewChild } from '@angular/core';
import { InvitationsComponent } from '../invitations/invitations.component';
@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css'
})
export class NewEventComponent {

  @ViewChild(InvitationsComponent) invitationsComponent!: InvitationsComponent;
  emails: string[] = [];

  getEmails(): void {
    if (this.invitationsComponent) {
      this.emails = [...this.invitationsComponent.emails];
    }
  }
}
