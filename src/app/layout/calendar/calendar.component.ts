import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  calendarOptions!: CalendarOptions;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCalendarItems();
  }

  loadCalendarItems(): void {
    this.http.get<any[]>('/api/calendar/items', { params: { userId: '1' } }).subscribe(
      data => {
        const events = data.map(item => ({
          title: item.name,
          start: item.date,
          color: this.getColor(item.type)
        }));

        this.calendarOptions = {
          initialView: 'dayGridMonth',
          events: events
        };
      },
      error => {
        console.error('Ошибка при получении календаря:', error);
      }
    );
  }

  getColor(type: string): string {
    switch (type) {
      case 'attend': return 'green';
      case 'organized': return 'blue';
      case 'service': return 'orange';
      default: return 'gray';
    }
  }
}
