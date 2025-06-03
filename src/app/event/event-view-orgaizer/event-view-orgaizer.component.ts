import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { Event, OrganizerDTO } from '../model/event.model';
import { EventTypeDTO, EventTypeService } from '../event-type.service';
import { Chart, registerables } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-view-orgaizer',
  templateUrl: './event-view-orgaizer.component.html',
  styleUrl: './event-view-orgaizer.component.css'
})
export class EventViewOrgaizerComponent  implements OnInit, AfterViewInit{


  event: Event | undefined;
  reviewText: string = '';
  reviewRating: number = 0;
  mapUrl: string = '';
  organizer: OrganizerDTO | undefined;
  currentPhotoIndex: number = 0; // Текущий индекс фотографии
  newPhotoUrl: string = '';
  chart: Chart | undefined;
  statisticsReady: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.loadEvent(eventId);
      this.loadOrganizer(eventId);

      setTimeout(() => {
        this.statisticsReady = true; // Имитация завершения подготовки
      }, 1000); // Задержка в 1 секунду
    }
  }

  addPhoto(): void {
    if (this.newPhotoUrl.trim()) {
      this.event.photos.push(this.newPhotoUrl.trim());
      this.newPhotoUrl = ''; // Очистить инпут
    }
  }

  downloadEventStatisticsPDF(): void {
    this.eventService.downloadEventStatisticsPDF(this.event.id);
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

  ngAfterViewInit(): void {
    // Построение графика после загрузки DOM
    this.buildChart();
  }

  buildChart(): void {
    // Убедитесь, что canvas элемент существует
    const canvas = document.getElementById('eventChart') as HTMLCanvasElement | null;
  
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Participants', 'Max Participants', 'Rating'],
        datasets: [
          {
            label: 'Event Stats',
            data: [25, 50, 4.5], // Пример данных
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  removePhoto(index: number): void {
    this.event.photos.splice(index, 1);
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
    // Например: this.eventService.updateEvent(this.event).subscribe();event/:id/agenda
  }
  openAgengda(): void {
    this.router.navigate([`event/${this.event.id}/agenda`])
  }
  openBudgetPlanning():void{
    this.router.navigate(['/budget-planning', this.event.id]);
  }
}
