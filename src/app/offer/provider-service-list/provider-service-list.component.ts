import { Component } from '@angular/core';
import { OfferService } from '../offer.service';
import { Service } from '../model/offer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-service-list',
  templateUrl: './provider-service-list.component.html',
  styleUrl: './provider-service-list.component.css'
})
export class ProviderServiceListComponent {
  services:Service [];

  isFilterVisible = false;
  constructor(private offerService: OfferService, private router: Router) {}
  isButtonDisabled: boolean = false; // Default to enabled

  ngOnInit(): void {
    this.services = this.offerService.getServices();
    console.log(this.services);
    
  }
  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
    this.isButtonDisabled = this.isFilterVisible;
  }
  onAddClick(): void {
    this.router.navigate(['/service-form']);
  }
}
