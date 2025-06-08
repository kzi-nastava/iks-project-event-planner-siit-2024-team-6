import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';

import { FullCalendarModule } from '@fullcalendar/angular';
import { AuthService } from '../../infrastructure/auth/auth.service';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router } from '@angular/router';

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
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadCalendarItems();
  }

  loadCalendarItems(): void {
    this.http.get<any[]>('/api/calendar/items').subscribe({
      next: (data) => {
        console.log('calendar items:', data);

        this.calendarOptions.events = data.map(item => ({
          id: item.id,
          title: item.name,
          start: item.date,
          color: this.getColor(item.type),
            extendedProps: {
            type: item.type
          }
        }));
      },
      error: (error) => {
        console.error('fetching error:', error);
      }
    });
  }

  getColor(type: string): string {
    switch (type) {
      case 'Event': return 'green';
      case 'MyEvent': return 'blue';
      case 'MyService': return 'orange';
      default: return 'gray';
    }
  }

  handleEventClick(arg: EventClickArg) {
  const type = arg.event.extendedProps['type'];
  const id = arg.event.id;

  if (type === 'MyService') {
    this.router.navigate(['/offer', id]);
  } else {
    this.router.navigate(['/event', id]);
  }
  }
}


