import { Component, Input } from '@angular/core';
import { Event } from '../model/event.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-top-event-card',
  templateUrl: './top-event-card.component.html',
  styleUrls: ['./top-event-card.component.css']
})
export class TopEventCardComponent {
  @Input() event!: Event;
  constructor(private router: Router) {}

  onViewClick() {
    this.router.navigate(['/event', this.event.id]);
  }
}
