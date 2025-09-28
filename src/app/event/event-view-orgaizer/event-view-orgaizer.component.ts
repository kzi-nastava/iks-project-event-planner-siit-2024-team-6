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
export class EventViewOrgaizerComponent implements OnInit, AfterViewInit {


  event: Event | undefined;
  reviewText: string = '';
  reviewRating: number = 0;
  mapUrl: string = '';
  organizer: OrganizerDTO | undefined;
  currentPhotoIndex: number = 0; // Текущий индекс фотографии
  newPhotoUrl: string = '';
  chart: Chart | undefined;
  statisticsReady: boolean = false;
  isFavorite: boolean  = false;
statisticsData: { participants: number, maxParticipants: number, rating: number } | null = null;

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

    this.eventService.getEventStatistics(eventId).subscribe({
      next: (stats) => {
        this.statisticsData = stats;
        this.statisticsReady = true;

        // Подождём до следующего цикла рендера Angular, чтобы canvas успел появиться
        setTimeout(() => {
          this.buildChart();
        }, 0);
      },
      error: () => {
        this.showSnack('Failed to load event statistics', true);
      }
    });
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
  checkFavorite() {
    this.eventService.isFavorited(this.event.id).subscribe({
      next: (fav) => (this.isFavorite = fav),
      error: (err) => this.showSnack('Failed to load favourite status', true),
    });
  }
    showSnack(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? 'snack-error' : 'snack-success'
    });
  }
  loadEvent(id: number): void {
    this.eventService.getEventById(id).subscribe((event) => {
      if (event) {
        this.event = event;
        this.checkFavorite(); // Проверка на избранное после загрузки события
      } else {
        console.error('Event not found');
      }
    });
  }
  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
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
  ngAfterViewInit(): void {
    // Построение графика после загрузки DOM
    // this.buildChart();
  }

 buildChart(): void {
  if (!this.statisticsData) return;

  const canvas = document.getElementById('eventChart') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (this.chart) {
    this.chart.destroy(); // если график уже существует, удалим его
  }

  this.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Participants', 'Max Participants', 'Rating'],
      datasets: [
        {
          label: 'Event Statistics',
          data: [
            this.statisticsData.participants,
            this.statisticsData.maxParticipants,
            this.statisticsData.rating
          ],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)'],
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
  loadOrganizer(id: number): void {
    this.eventService.getEventOrganizer(id).subscribe((organizer) => {
      if (organizer) {
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
  if (!this.isFormValid()) return;

  this.update();
  this.router.navigate([`my_events`]);
}

  update(): void {
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
  openBudgetPlanning(): void {
    this.router.navigate(['/budget-planning', this.event.id]);
  }
  isFutureDate(date: string | Date): boolean {
    const eventDate = new Date(date);
    const now = new Date();
    return eventDate.getTime() > now.getTime();
  }
isFormValid(): boolean {
  if (!this.event.name || this.event.name.trim() === '') {
    this.showSnack('Event name is required', true);
    return false;
  }

  if (!this.event.description || this.event.description.trim() === '') {
    this.showSnack('Description is required', true);
    return false;
  }

  if (!this.event.place || this.event.place.trim() === '') {
    this.showSnack('Place is required', true);
    return false;
  }

  if (!this.event.maxParticipants || isNaN(+this.event.maxParticipants)) {
    this.showSnack('Max participants must be a number', true);
    return false;
  }

  if (!this.event.date) {
    this.showSnack('Date is required', true);
    return false;
  }

  return true;
}
}
