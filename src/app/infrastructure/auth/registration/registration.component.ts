import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  isProvider: boolean = false;

  // check
  toggleProvider(isProvider: boolean): void {
    this.isProvider = isProvider;
  }
}
