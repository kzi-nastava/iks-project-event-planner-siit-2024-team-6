import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NewOfferDTO } from '../../dto/offer-dtos';
import { Product } from '../model/offer.model';
import { OfferService } from '../offer.service';
import { EventService } from '../../event/event.service';

@Component({
  selector: 'app-provider-product-edit',
  templateUrl: './provider-product-edit.component.html',
  styleUrl: './provider-product-edit.component.css'
})
export class ProviderProductEditComponent {

  productForm!: FormGroup;
  offer: Product | null = null;
  eventTypes: string[] = [];
  selectedEventTypes: string[] = [];
  photos: string[] = []
  isFixedDuration: boolean = true; // Default to fixed duration

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private offerService: OfferService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    // Retrieve the offer object passed via Router State
    const navigation = this.router.getCurrentNavigation();
    this.offer = this.offerService.getProduct();

    if (!this.offer) {
      console.error('No offer found, redirecting to my-products');
      this.router.navigate(['/my-products']);
      return;
    }

    this.fetchEventTypes();

    //  // Set initial duration type state
    //  this.isFixedDuration = this.offer.preciseDuration != 0 && this.offer.preciseDuration != null;

     // Pre-select event types if available
    this.selectedEventTypes = [];
    this.offer.eventTypes.forEach(eventType => {this.selectedEventTypes.push(eventType.name)});

    // Initialize the form with default values
    this.productForm = this.fb.group({
      name: [this.offer.name, Validators.required],
      description: [this.offer.description, Validators.required],
      price: [this.offer.price, [Validators.required, Validators.min(0.1)]],
      discount: [this.offer.sale, [Validators.min(0)]],
      visibility: [this.offer.isVisible],
      availability: [this.offer.isAvailable],
      durationType: [this.isFixedDuration ? 'fixed' : 'varied'],
      eventTypes: [this.selectedEventTypes, this.validateEventTypes()]
    });

    this.photos = this.offer.photos;

  }

  onPhotoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }
  

  // Navigate back to the products list
  goBack(): void {
    this.router.navigate(['/my-products']);
  }



  

  // Handle event type checkbox changes
  onEventTypeChange(eventType: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedEventTypes.push(eventType);
    } else {
      this.selectedEventTypes = this.selectedEventTypes.filter(type => type !== eventType);
    }
    // Update the value and validity of the eventTypes control
    this.productForm.get('eventTypes')?.setValue(this.selectedEventTypes);
    this.productForm.get('eventTypes')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.productForm.valid && this.offer) {
      // Fetch event types based on selected names
      const eventTypeObservables = this.selectedEventTypes.map(name =>
        this.eventService.getEventTypeByName(name)
      );
  
      forkJoin(eventTypeObservables).subscribe({
        next: (eventTypes) => {
          // Create the updated offer payload
          const updatedOffer: NewOfferDTO = {
            name: this.productForm.value.name,
            description: this.productForm.value.description,
            specifics: this.productForm.value.specifics,
            price: this.productForm.value.price,
            sale: this.productForm.value.discount,
            isVisible: this.productForm.value.visibility,
            isAvailable: this.productForm.value.availability,
            type: "product",
            isReservationAutoApproved: this.productForm.value.isFixedDuration !== "fixed" && this.productForm.value.confirmation === "automatic",
            eventTypes: eventTypes, // Add the fetched event types
            photos: this.photos,
            isDeleted: false,
            category: this.offer.category,
          };
  
          // Call the product to update the offer
          this.offerService.updateProduct(this.offer.id, updatedOffer).subscribe({
            next: (response) => {
              console.log('Offer updated successfully:', response);
              this.router.navigate(['/my-products']);
            },
            error: (err) => {
              console.error('Error updating offer:', err);
            },
          });
        },
        error: (err) => {
          console.error('Error fetching event types:', err);
        },
      });
    } else {
      console.error('Form is invalid or offer data is missing!');
    }
  }
  

  fetchEventTypes(): void {
    this.eventService.getAllNames().subscribe({
      next: (data) => {
        this.eventTypes = data;
      },
      error: (err) => {
        console.error('Error fetching strings:', err);
      }
    });
  }

  onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file) => {
        this.photos.push(URL.createObjectURL(file)); // Store the temporary URL
      });
    }
  }

  removePhoto(index: number): void {
    this.photos.splice(index, 1);
  }

  validateEventTypes(): Validators {
    return (control: AbstractControl) => {
      const selectedTypes = control.value;
      if (!selectedTypes || selectedTypes.length === 0) {
        return { noEventTypesSelected: true }; // Return error if no types are selected
      }
      return null; // Valid if at least one is selected
    };
  }
  
  
}
