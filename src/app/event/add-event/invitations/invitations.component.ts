import { Component } from '@angular/core';
@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.css'
})
export class InvitationsComponent {

  email: string = '';
  emails: string[] = [];


  addEmail(): void {
    if (this.email && this.isValidEmail(this.email)) {
      this.emails.push(this.email.trim());
      this.email = '';
    }
  }

  removeEmail(index: number): void {
    this.emails.splice(index, 1);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getEmails(): string[] {
    return this.emails;
  }

}
