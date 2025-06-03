import { Component, Input } from '@angular/core';
import { Service } from '../../model/offer.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { OrganizersEventDTO } from '../../../dto/event-dtos';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewReservationDTO } from '../../../dto/reservation-dtos';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  userRole: string = '';
  selectedDate: Date | null = null;
  fromTime: string = '';
  toTime: string = '';
  minDate: Date = new Date();
  @Input() service!: Service;
  isPreciseDurationDefined: boolean = false;
  events: OrganizersEventDTO[] = [];
  selectedEvent: OrganizersEventDTO = null;
  organizerId: number | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private snackBar: MatSnackBar ) {}

  ngOnInit() {
    this.userRole = this.authService.getRole();
    console.log("ULOGAA ",this.userRole);
    if(this.userRole != "ROLE_ORGANIZER"){
      return;
    }
    this.calculateMinDate();
    this.isPreciseDurationDefined = this.service.preciseDuration !== 0;
    this.organizerId = this.authService.getUserId();
    this.fetchEvents().subscribe({
      next: (events) => {
        this.events = events; // No conversion of `date`
      },
      error: (error) => {
        console.error('Failed to fetch events:', error);
      }
    });
    console.log(this.service);
  }

  //takes into consideration latest reservation time
  calculateMinDate() {
    const today = new Date();
    const daysToAdd = Math.ceil(this.service.latestReservation / 24);
    today.setDate(today.getDate() + daysToAdd);
    this.minDate = today;
  }

  fetchEvents(): Observable<OrganizersEventDTO[]> {
    return this.http.get<OrganizersEventDTO[]>(`/api/organizers/${this.organizerId}/events`);
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


  book() {
    if (!this.validateFields()) {
      return;
    }
    
    const dto : NewReservationDTO = {
      startTime: new Date(
        this.selectedDate!.getFullYear(),
        this.selectedDate!.getMonth(),
        this.selectedDate!.getDate(),
        +this.fromTime.split(':')[0],
        +this.fromTime.split(':')[1]
      ),
      endTime: new Date(
        this.selectedDate!.getFullYear(),
        this.selectedDate!.getMonth(),
        this.selectedDate!.getDate(),
        +this.toTime.split(':')[0],
        +this.toTime.split(':')[1]
      ),
      serviceId: this.service.id,
      eventId: this.selectedEvent.id
    };

    console.log(dto);
    this.addReservation(dto);
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
  
  addReservation(dto: NewReservationDTO): void {  
    this.http.post('/api/reservations/', dto).subscribe({
      next: (response) => {
        this.snackBar.open('Reservation confirmed!', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        const errorMessage =
          error.error?.message || 'An unexpected error occurred.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
