import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../model/event.model';

@Component({
  selector: 'app-event-slider',
  templateUrl: './event-slider.component.html',
  styleUrls: ['./event-slider.component.css'],
})
export class EventSliderComponent implements OnInit {
  events: Event[] = [];
  currentPosition: number = 0;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events = this.eventService.getAll();
  }

  slideLeft(): void {
    const content = document.querySelector('.slider-content') as HTMLElement;
    const cardWidth = content.offsetWidth;
    this.currentPosition = Math.min(this.currentPosition + cardWidth, 0);
    content.style.transform = `translateX(${this.currentPosition}px)`;
  }

  slideRight(): void {
    const content = document.querySelector('.slider-content') as HTMLElement;
    const cardWidth = content.offsetWidth;
    const maxScroll = -(content.scrollWidth - content.offsetWidth);
    this.currentPosition = Math.max(this.currentPosition - cardWidth, maxScroll);
    content.style.transform = `translateX(${this.currentPosition}px)`;
  }
}
