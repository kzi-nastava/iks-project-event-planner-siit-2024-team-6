import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewCategoryDTO } from '../../dto/category-dtos';
import { OfferService } from '../offer.service';
import { EventService } from '../../event/event.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../category/category-dialog/category-dialog.component';
import { forkJoin } from 'rxjs';
import { NewOfferDTO } from '../../dto/offer-dtos';

@Component({
  selector: 'app-provider-product-form',
  templateUrl: './provider-product-form.component.html',
  styleUrl: './provider-product-form.component.css'
})
export class ProviderProductFormComponent {
  productForm!: FormGroup;
  categories: string[] = [];
  eventTypes: string[] = [];
  isFixedDuration: boolean = true; // Default to fixed duration
  newCategory: NewCategoryDTO = null;
  selectedEventTypes: string[] = [];
  selectedCategory: string = null;
  photos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private offerService: OfferService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.fetchEventTypes();
    this.fetchCategories();
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.1)]],
      discount: [null, [Validators.min(0)]],
      reservationDeadline: [null, [Validators.required, Validators.min(0.1)]],
      cancellationDeadline: [null, [Validators.required, Validators.min(0.1)]],
      eventTypes: [this.selectedEventTypes, this.validateEventTypes()],
      confirmation: ['automatic'],
      durationType: ['fixed'], // Initialize to 'fixed'
      visibility: [false],
      availability: [false],
      specifics: [''],
      photos:[[]],
      newCategory: [''],
      category: [Validators.required]
    });
    this.isFixedDuration = true;
    this.toggleDurationFields();
  }

  onPhotoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }

  goBack(): void {
    this.router.navigate(['/my-products']);
  }

  onDurationTypeChange(type: string): void {
    this.isFixedDuration = type === 'fixed';
    this.toggleDurationFields();
  }

  toggleDurationFields(): void {
    if (this.isFixedDuration) {
      this.productForm.get('confirmation')?.enable();
    } else {
      this.productForm.get('confirmation')?.disable();
    }
    this.updateDurationValidation();
  }

  updateDurationValidation(): void {
    const isFixed = this.isFixedDuration;

    if (isFixed) {
      this.productForm.get('duration')?.setValidators([Validators.required, Validators.min(1)]);
      this.productForm.get('minDuration')?.clearValidators();
      this.productForm.get('maxDuration')?.clearValidators();
    } else {
      this.productForm.get('duration')?.clearValidators();
      this.productForm.get('minDuration')?.setValidators([Validators.required, Validators.min(1)]);
      this.productForm.get('maxDuration')?.setValidators([Validators.required, Validators.min(1)]);
    }

    this.productForm.get('duration')?.updateValueAndValidity();
    this.productForm.get('minDuration')?.updateValueAndValidity();
    this.productForm.get('maxDuration')?.updateValueAndValidity();
  }

  onEventTypeChange(eventType: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedEventTypes.push(eventType);
    } else {
      this.selectedEventTypes = this.selectedEventTypes.filter((type) => type !== eventType);
    }
    this.productForm.get('eventTypes')?.setValue(this.selectedEventTypes);
    this.productForm.get('eventTypes')?.updateValueAndValidity();

    this.cdr.detectChanges(); // Trigger change detection manually
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const eventTypeObservables = this.selectedEventTypes.map((name) =>
        this.eventService.getEventTypeByName(name)
      );

      forkJoin(eventTypeObservables).subscribe({
        next: (eventTypes) => {
          const createdOffer: NewOfferDTO = {
            name: this.productForm.value.name,
            description: this.productForm.value.description,
            specifics: this.productForm.value.specifics,
            price: this.productForm.value.price,
            sale: this.productForm.value.discount,
            isVisible: this.productForm.value.visibility,
            isAvailable: this.productForm.value.availability,
            type: 'product',
            preciseDuration: this.productForm.value.duration || 0,
            minDuration: this.productForm.value.minDuration || 0,
            maxDuration: this.productForm.value.maxDuration || 0,
            latestReservation: this.productForm.value.reservationDeadline,
            latestCancelation: this.productForm.value.cancellationDeadline,
            isReservationAutoApproved: this.productForm.value.isFixedDuration !== 'fixed' && this.productForm.value.confirmation === 'automatic',
            eventTypes: eventTypes,
            photos: this.photos,
            isDeleted: false,
            category: this.productForm.value.category,
            categorySuggestion: this.newCategory,
          };
          console.log(createdOffer);

          this.offerService.createProduct(createdOffer).subscribe({
            next: (response) => {
              console.log('Offer updated successfully:', response);
              this.router.navigate(['/my-products']);
            },
            error: (err) => {
              console.error('Error creating offer:', err);
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
        console.error('Error fetching event types:', err);
      },
    });
  }

  fetchCategories(): void{
    this.offerService.getAllCategories().subscribe({
      next: (data) => {
          this.categories = data;
          if (this.categories.length > 0) {
            this.productForm.get('category')?.setValue(this.categories[0]);
          }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
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
        return { noEventTypesSelected: true };
      }
      return null;
    };
  }
  proposeCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Proposed Category:', result);
        this.newCategory = result;
      }
    });
  }
}
