import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event, OrganizerDTO } from '../model/event.model';
import { EventTypeDTO, EventTypeService } from '../event-type.service';
import { ActivityService } from '../activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../../report/report-dialog/report-dialog.component';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { NotificationService } from '../../notification/notification.service';
import { NewNotificationDTO } from '../../notification/model/notification.model';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrl: './event-view.component.css'
})
export class EventViewComponent implements OnInit{
  event: Event | undefined;
  reviewText: string = '';
  reviewRating: number = 0;
  mapUrl: string = '';
  organizer: OrganizerDTO | undefined;
  currentPhotoIndex: number = 0; // Текущий индекс фотографии
  agendaReady: boolean = false;
  infoReady: boolean = false;
  loggedIn: boolean = false;
  isParticipated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private activityService: ActivityService,
    private snackBar: MatSnackBar,
    private reportDialog: MatDialog,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.loadEvent(eventId);
      this.loadOrganizer(eventId);
      this.checkParticipation(eventId);

      setTimeout(() => {
        this.agendaReady = true; // Имитация завершения подготовки
        this.infoReady = true;
      }, 1000); // Задержка в 1 секунду
    }
    this.loggedIn = this.authService.isLoggedIn();
  }
  checkParticipation(eventId: number): void {
    this.eventService.getParticipatedEvents().subscribe((attends) => {
      this.isParticipated = attends.some(event => event.id === eventId);
    });
  }

  downloadAgenda(): void {
    this.activityService.downloadAgendaPdf(this.event.id);
  }

  downloadInfo(): void {
    this.eventService.downloadInfoPdf(this.event.id);
  }

  loadEvent(id: number): void {
    this.eventService.getEventById(id).subscribe((event) => {
      if(event){
      this.event = event;

      } else {
        console.error('Event not found');
      }
    });
  }
loadOrganizer(id: number): void{
  this.eventService.getEventOrganizer(id).subscribe((organizer) => {
    if(organizer){
      this.organizer = organizer;
    } else {
      console.error('Event not found');
    }
  });
}
  addToFavorites(): void {
    this.eventService.getFavorites().subscribe((favorites) => {
      const isFavorite = favorites.some(event => event.id === this.event.id);

      if (isFavorite) {
        this.eventService.removeFromFavorites(this.event.id).subscribe(() => {
          this.snackBar.open(`Event ${this.event.name} removed from favorites`, 'Close', {
            duration: 3000,
          });
        });
      } else {
        this.eventService.addToFavorites(this.event.id).subscribe(() => {
          this.snackBar.open(`Event ${this.event.name} added to favorites`, 'Close', {
            duration: 3000,
          });
        });
      }
    });
  }


    participate(): void {
    this.eventService.getParticipatedEvents().subscribe((attends) => {
       const isCurrentlyParticipated = attends.some(event => event.id === this.event.id);

      if (isCurrentlyParticipated) {
        this.eventService.removeParticipation(this.event.id).subscribe(() => {
          this.snackBar.open(`Event ${this.event.name} removed from attends`, 'Close', {
            duration: 3000,
          });
        });
      } else {
        this.eventService.participateInEvent(this.event.id).subscribe(() => {
          this.snackBar.open(`Event ${this.event.name} added to attends`, 'Close', {
            duration: 3000,
          });
        });
      }
    });
  }

  submitReview(): void {
    console.log('Review submitted:', this.reviewText, this.reviewRating);
     const stars = '⭐'.repeat(this.reviewRating || 0);
    const notificationText = `You got a new review for "${this.event.name}": Comment: ${this.reviewText || 'No comment'} - Rating: ${stars} (${this.reviewRating || '_'}/5)`;

    const newNotification: NewNotificationDTO = {
    receiverId: this.organizer.id,
    text: notificationText
  };

  this.notificationService.createNotification(newNotification).subscribe({
    next: (notification) => {
      this.snackBar.open('Notification sent', 'Close', { duration: 3000 });
      this.reviewText = '';
      this.reviewRating = 0;
    },
    error: (err) => {
      console.error('Failed to send notification', err);
      this.snackBar.open('Failed to send review notification', 'Close', { duration: 3000 });
    }
  });
  }

  //Ph

  nextPhoto(): void {
    if (this.event?.photos) {
      this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.event.photos.length;
    }
  }

  prevPhoto(): void {
    if (this.event?.photos) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex - 1 + this.event.photos.length) % this.event.photos.length;
    }
  }


reportOrganizer(): void {
    console.log("USAO");
    if (!this.organizer) {
    console.error("Organizer not loaded");
    return;
  }

  const dialogRef = this.reportDialog.open(ReportDialogComponent, {
    width: '400px',
    data: {
      reportedId: this.organizer.id,
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.snackBar.open('Report submitted successfully', 'Close', { duration: 3000 });
    }
  });
  }

}
