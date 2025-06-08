import { Component, Inject, Input, OnInit } from '@angular/core';
import { Service } from '../../model/offer.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { OrganizersEventDTO } from '../../../dto/event-dtos';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewReservationDTO } from '../../../dto/reservation-dtos';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  userRole: string = '';
  selectedDate: Date | null = null;
  fromTime: string = '';
  toTime: string = '';
  minDate: Date = new Date();

  service!: Service;

  isPreciseDurationDefined: boolean = false;
  events: OrganizersEventDTO[] = [];
  selectedEvent: OrganizersEventDTO | null = null;
  organizerId: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: { service: Service },
    private dialogRef: MatDialogRef<ReservationComponent>
  ) {this.service = data.service;}

  ngOnInit() {
    this.userRole = this.authService.getRole();

    if (this.userRole !== 'ROLE_ORGANIZER') {
      return;
    }

    this.calculateMinDate();
    this.isPreciseDurationDefined = this.service.preciseDuration !== 0;
    this.organizerId = this.authService.getUserId();

    this.fetchEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (error) => {
        console.error('Failed to fetch events:', error);
        this.snackBar.open('Failed to load events.', 'Close', { duration: 3000 });
      }
    });
  }

  calculateMinDate() {
    const today = new Date();
    const daysToAdd = Math.ceil(this.service.latestReservation / 24);
    today.setDate(today.getDate() + daysToAdd);
    this.minDate = today;
  }

  fetchEvents(): Observable<OrganizersEventDTO[]> {
    return this.http.get<OrganizersEventDTO[]>(`/api/organizers/future-events`);
  }

  onFromTimeChange() {
    if (this.isPreciseDurationDefined && this.fromTime) {
      this.calculateToTime();
    }
  }

  calculateToTime() {
    const [hours, minutes] = this.fromTime.split(':').map(Number);
    const preciseDurationInMinutes = this.service.preciseDuration;

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + preciseDurationInMinutes);

    const toHours = String(date.getHours()).padStart(2, '0');
    const toMinutes = String(date.getMinutes()).padStart(2, '0');

    this.toTime = `${toHours}:${toMinutes}`;
  }

  validateFields(): boolean {
    if (!this.selectedEvent) {
      this.snackBar.open('Please select an event for your reservation.', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (!this.selectedDate) {
      this.snackBar.open('Please select a date for your reservation.', 'Close', {
        duration: 3000,
      });
      return false;
    }
    if (!this.fromTime || !this.toTime) {
      this.snackBar.open('Please select a time for your reservation.', 'Close', {
        duration: 3000,
      });
      return false;
    }
    return true;
  }

  book() {
    if (!this.validateFields()) {
      return;
    }

    const dateString = `${this.selectedDate!.getFullYear()}-${String(this.selectedDate!.getMonth() + 1).padStart(2, '0')}-${String(this.selectedDate!.getDate()).padStart(2, '0')}`;

    const startDateTimeStr = `${dateString}T${this.fromTime}:00`;
    const endDateTimeStr = `${dateString}T${this.toTime}:00`;

    const dto: NewReservationDTO = {
      startTime: startDateTimeStr,
      endTime: endDateTimeStr,
      serviceId: this.service.id,
      eventId: this.selectedEvent!.id
    };

    this.http.post('/api/reservations/', dto).subscribe({
      next: () => {
        this.snackBar.open('Reservation confirmed!', 'Close', {
          duration: 5000,
        });
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'An unexpected error occurred.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
        });
      },
    });
    this.dialogRef.close();
  }
}
