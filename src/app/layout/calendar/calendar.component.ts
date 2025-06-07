import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';

import { FullCalendarModule } from '@fullcalendar/angular';
import { AuthService } from '../../infrastructure/auth/auth.service';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    selectable: true,
    editable: true,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCalendarItems();
  }

  loadCalendarItems(): void {
    this.http.get<any[]>('/api/calendar/items').subscribe({
      next: (data) => {
        console.log('calendar items:', data);

        // Просто обновляем события
        this.calendarOptions.events = data.map(item => ({
          title: item.name,
          start: item.date,
          color: this.getColor(item.type)
        }));
      },
      error: (error) => {
        console.error('Ошибка загрузки:', error);
      }
    });
  }

  getColor(type: string): string {
    switch (type) {
      case 'attend': return 'green';
      case 'organized': return 'blue';
      case 'service': return 'orange';
      default: return 'gray';
    }
  }

  handleDateClick(arg: DateClickArg) {
    const title = prompt('Введите название события:');
    if (title) {
      const newEvent = {
        title,
        start: arg.dateStr,
        color: 'purple'
      };

      const calendarApi = arg.view.calendar;
      calendarApi.addEvent(newEvent);

      console.log('Новое событие:', newEvent);
    }
  }

  handleEventClick(arg: EventClickArg) {
    if (confirm(`Удалить событие "${arg.event.title}"?`)) {
      arg.event.remove();
    }
  }
}


