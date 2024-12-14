import { Component, OnInit } from '@angular/core';
import { Offer } from '../model/offer.model';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-offer-slider',
  templateUrl: './offer-slider.component.html',
  styleUrl: './offer-slider.component.css'
})
export class OfferSliderComponent implements OnInit{
  offers: Offer[] = [];
  currentPosition: number = 0;

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.offerService.getTopFive().subscribe({
      next: (data: Offer[]) => {
        this.offers = data;
      },
      error: (err) => {
        console.error('Error fetching top five offers:', err);
      },
    });
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

