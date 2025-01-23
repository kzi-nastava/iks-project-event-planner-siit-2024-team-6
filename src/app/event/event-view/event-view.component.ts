import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';
import { Event, OrganizerDTO } from '../model/event.model';
import { EventTypeDTO, EventTypeService } from '../event-type.service';
import { ActivityService } from '../activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private activityService: ActivityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.loadEvent(eventId);
      this.loadOrganizer(eventId);

      setTimeout(() => {
        this.agendaReady = true; // Имитация завершения подготовки
        this.infoReady = true;
      }, 1000); // Задержка в 1 секунду
    }
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

  submitReview(): void {
    console.log('Review submitted:', this.reviewText, this.reviewRating);
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
}
