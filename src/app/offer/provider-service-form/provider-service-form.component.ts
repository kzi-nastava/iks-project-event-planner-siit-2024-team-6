import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { forkJoin } from 'rxjs';
import { EventService } from '../../event/event.service';
import { NewOfferDTO } from '../../dto/offer-dtos';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDTO } from '../../dto/category-dtos';
import { CategoryDialogComponent } from '../../category/category-dialog/category-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorFn, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-provider-service-form',
  templateUrl: './provider-service-form.component.html',
  styleUrls: ['./provider-service-form.component.css'],
})
export class ProviderServiceFormComponent implements OnInit {
  serviceForm!: FormGroup;
  categories: string[] = [];
  eventTypes: string[] = [];
  isFixedDuration: boolean = true; // Default to fixed duration
  newCategory: NewCategoryDTO = null;
  selectedEventTypes: string[] = [];
  selectedCategory: string = null;
  photos: string[] = [];
  proposedCategory = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private offerService: OfferService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.1)]],
      discount: [null, [Validators.min(0)]],
      duration: [null, [Validators.required, Validators.min(0.1)]],
      minDuration: [null, [Validators.required, Validators.min(0.1)]],
      maxDuration: [null, [Validators.required, Validators.min(0.1)]],
      reservationDeadline: [null, [Validators.required, Validators.min(0.1)]],
      cancellationDeadline: [null, [Validators.required, Validators.min(0.1)]],
      eventTypes: [this.selectedEventTypes, this.validateEventTypes()],
      confirmation: ['automatic'],
      durationType: ['fixed'], // Initialize to 'fixed'
      visibility: [false],
      availability: [false],
      specifics: [''],
      photos: [[]],
      newCategory: [''],
      category: [null]
    });
    this.isFixedDuration = true;
    this.toggleDurationFields();
    this.updateCategoryValidation();
    this.fetchEventTypes();
    this.fetchCategories();
  }

  onPhotoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }

  goBack(): void {
    this.router.navigate(['/my-services']);
  }

  onDurationTypeChange(type: string): void {
    this.isFixedDuration = type === 'fixed';
    this.toggleDurationFields();
  }

  toggleDurationFields(): void {
    if (this.isFixedDuration) {
      this.serviceForm.get('duration')?.enable();
      this.serviceForm.get('minDuration')?.disable();
      this.serviceForm.get('maxDuration')?.disable();
      this.serviceForm.get('confirmation')?.enable();
    } else {
      this.serviceForm.get('duration')?.disable();
      this.serviceForm.get('minDuration')?.enable();
      this.serviceForm.get('maxDuration')?.enable();
      this.serviceForm.get('confirmation')?.disable();
    }
    this.updateDurationValidation();
  }

  updateDurationValidation(): void {
    const isFixed = this.isFixedDuration;

    if (isFixed) {
      this.serviceForm.get('duration')?.setValidators([Validators.required, Validators.min(1)]);
      this.serviceForm.get('minDuration')?.clearValidators();
      this.serviceForm.get('maxDuration')?.clearValidators();
    } else {
      this.serviceForm.get('duration')?.clearValidators();
      this.serviceForm.get('minDuration')?.setValidators([Validators.required, Validators.min(1)]);
      this.serviceForm.get('maxDuration')?.setValidators([Validators.required, Validators.min(1)]);
    }

    this.serviceForm.get('duration')?.updateValueAndValidity();
    this.serviceForm.get('minDuration')?.updateValueAndValidity();
    this.serviceForm.get('maxDuration')?.updateValueAndValidity();
  }

  onEventTypeChange(eventType: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedEventTypes.push(eventType);
    } else {
      this.selectedEventTypes = this.selectedEventTypes.filter((type) => type !== eventType);
    }
    this.serviceForm.get('eventTypes')?.setValue(this.selectedEventTypes);
    this.serviceForm.get('eventTypes')?.updateValueAndValidity();

    this.cdr.detectChanges(); // Trigger change detection manually
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const eventTypeObservables = this.selectedEventTypes.map((name) =>
        this.eventService.getEventTypeByName(name)
      );

      forkJoin(eventTypeObservables).subscribe({
        next: (eventTypes) => {
          const createdOffer: NewOfferDTO = {
            name: this.serviceForm.value.name,
            description: this.serviceForm.value.description,
            specifics: this.serviceForm.value.specifics,
            price: this.serviceForm.value.price,
            sale: this.serviceForm.value.discount,
            isVisible: this.serviceForm.value.visibility,
            isAvailable: this.serviceForm.value.availability,
            type: 'Service',
            preciseDuration: this.serviceForm.value.duration || 0,
            minDuration: this.serviceForm.value.minDuration || 0,
            maxDuration: this.serviceForm.value.maxDuration || 0,
            latestReservation: this.serviceForm.value.reservationDeadline,
            latestCancelation: this.serviceForm.value.cancellationDeadline,
            isReservationAutoApproved: this.isFixedDuration && this.serviceForm.value.confirmation === 'automatic',
            eventTypes: eventTypes,
            photos: this.photos,
            isDeleted: false,
            category: this.serviceForm.value.category,
            categorySuggestion: this.newCategory,
          };
          console.log(createdOffer);

          this.offerService.createService(createdOffer).subscribe({
            next: (response) => {
               this.snackBar.open('Offer created successfully', 'Close', {
                duration: 3000, 
                panelClass: ['snackbar-success']
              });
              console.log('Offer created successfully:', response);
              this.router.navigate(['/my-services']);
            },
            error: (err) => {
              this.showError("Error creating offer:"+err);
              console.error('Error creating offer:', err);
            },
          });
        },
        error: (err) => {
          this.showError("Error fetching event types:"+err);
          console.error('Error fetching event types:', err);
        },
      });
    } else {
      this.showError("Form is invalid or offer data is missing!");
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

  addPhotoUrl(url: string): void {
    this.photos.push(url);
    this.serviceForm.get('photos')?.setValue(this.photos);
  }

  fetchCategories(): void {
    this.offerService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        const categoryCtrl = this.serviceForm.get('category');

        // Only pick default if NOT proposing and nothing selected
        if (!this.proposedCategory && !categoryCtrl?.value && this.categories.length > 0) {
          categoryCtrl?.setValue(this.categories[0]);
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

  validateEventTypes(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selected = control.value as string[] | null;
    return !selected || selected.length === 0 ? { noEventTypesSelected: true } : null;
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
        this.proposedCategory = true;
        const categoryCtrl = this.serviceForm.get('category');
        categoryCtrl?.setValue(null);
        this.updateCategoryValidation();
      }
    });
  }
  showError(message: string): void{
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }
  private updateCategoryValidation(): void {
    const categoryCtrl = this.serviceForm.get('category');
    if (!categoryCtrl) return;

    if (this.proposedCategory) {
      categoryCtrl.clearValidators();
    } else {
      categoryCtrl.setValidators([Validators.required]);
    }
    categoryCtrl.updateValueAndValidity({ emitEvent: false });
  }

}
