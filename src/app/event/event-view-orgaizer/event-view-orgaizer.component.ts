import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { Event, OrganizerDTO } from '../model/event.model';
import { EventTypeDTO, EventTypeService } from '../event-type.service';

@Component({
  selector: 'app-event-view-orgaizer',
  templateUrl: './event-view-orgaizer.component.html',
  styleUrl: './event-view-orgaizer.component.css'
})
export class EventViewOrgaizerComponent  implements OnInit{

  event: Event | undefined;
  reviewText: string = '';
  reviewRating: number = 0;
  mapUrl: string = '';
  organizer: OrganizerDTO | undefined;
  currentPhotoIndex: number = 0; // Текущий индекс фотографии
  newPhotoUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.loadEvent(eventId);
      this.loadOrganizer(eventId);
    }
  }

  addPhoto(): void {
    if (this.newPhotoUrl.trim()) {
      this.event.photos.push(this.newPhotoUrl.trim());
      this.newPhotoUrl = ''; // Очистить инпут
    }
  }

  removePhoto(index: number): void {
    this.event.photos.splice(index, 1);
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
    console.log('Added to favorites');
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
  saveChanges(): void {
    this.update();
    this.router.navigate([`my_events`]);

  }
  update(): void{
    this.eventService.updateEvent(this.event).subscribe();
  }
  deleteEvent(): void {
    this.eventService.deleteEvent(this.event.id).subscribe();
    this.update();
    this.router.navigate([`my_events`]);
  }
  toggleDeleted(): void {
    console.log(`Event status changed to: ${this.event.isDeleted ? 'Deleted' : 'Active'}`);
    // Здесь можно вызвать API для обновления статуса события
    // this.eventService.updateEvent(this.event).subscribe();
  }
  activateEvent(): void {
    this.event.isDeleted = false; // Устанавливаем isDeleted = false
    this.update();
    this.router.navigate([`my_events`]);
    // Реализуйте логику отправки данных на сервер
    // Например: this.eventService.updateEvent(this.event).subscribe();
  }
}
