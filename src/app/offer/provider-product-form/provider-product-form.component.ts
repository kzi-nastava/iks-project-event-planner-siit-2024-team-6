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
import { CategoryService } from '../../category/category.service';
import { HttpClient } from '@angular/common/http';

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
  allCategories: { id: number; name: string }[] = [];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private offerService: OfferService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.loadAllCategories();
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.1)]],
      discount: [null, [Validators.min(0)]],
      eventTypes: [this.selectedEventTypes],
      confirmation: ['automatic'],
      visibility: [false],
      availability: [false],
      photos:[[]],
      newCategory: [''],
      category: [Validators.required]
    });
  }

  loadAllCategories(): void {
    this.http
      .get<{ content: { id: number; name: string }[] }>('/api/admins/categories')
      .subscribe({
        next: (data) => {
          this.allCategories = data.content; // Извлекаем массив из ключа content
          console.log('Loaded categories:', this.allCategories);
          this.initCategSelect();
        },
        error: (err) => {
          console.error('Failed to load categories:', err);
        }
      });
  }

  initCategSelect(){
    this.selectedCategory = this.allCategories[0].name;
    const c = this.allCategories.find(cat => cat.name == this.selectedCategory);
    console.log('z:', this.selectedCategory);
    this.fetchEventTypes(c.id);
  }
  onCategorySelect() {
    this.selectedCategory = this.productForm.value.category;
    const c = this.allCategories.find(cat => cat.name == this.selectedCategory);
    this.fetchEventTypes(c.id);
    }
    addPhotoUrl(url: string): void {
      if (url) {
        this.photos.push(url);
        this.productForm.get('photos')?.setValue(this.photos);
      }
    }
  onPhotoError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x200.png?text=404+Not+Found';
  }

  goBack(): void {
    this.router.navigate(['/my-products']);
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
            price: this.productForm.value.price,
            sale: this.productForm.value.discount,
            isVisible: this.productForm.value.visibility,
            isAvailable: this.productForm.value.availability,
            type: 'product',
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

  fetchEventTypes(categoryId: number): void {
    this.eventService.getEventTypesByCategory(categoryId).subscribe({
      next: (data) => {
        this.eventTypes = data.map(event => event.name);; 
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
