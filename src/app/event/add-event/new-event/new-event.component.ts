import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../event.service';
import { Event } from '../../model/event.model';
import { EventTypeDTO, EventTypeService } from '../../event-type.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css'],
})
export class NewEventComponent implements OnInit {
  eventForm: FormGroup; // Реактивная форма
  eventTypes: EventTypeDTO[] = [];
  photos: string[] = []; // Массив для хранения URL фотографий
  isPublic: boolean = true;
  selectedCategories: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private eventTypeService: EventTypeService,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      maxParticipants: [null, [Validators.required, Validators.min(1)]],
      place: ['', Validators.required],
      date: [null, Validators.required],
      eventType: [null, Validators.required],
      photos: [[]],
      minParticipants: [0],
      disabled: [false],
    });
  }

  ngOnInit(): void {
    this.loadEventTypes();
  }

  loadCategories(): void {
    this.eventForm.get('eventType')?.valueChanges.subscribe((eventTypeId) => {
      console.log('Selected EventType ID (raw):', eventTypeId);
  
      const parsedEventTypeId = Number(eventTypeId);
      console.log('Parsed EventType ID:', parsedEventTypeId);
  
      const selectedType = this.eventTypes.find(type => type.id === parsedEventTypeId);
      console.log('Selected EventType:', selectedType);
  
      if (selectedType) {
        this.selectedCategories = selectedType.categories;
        console.log('Loaded Categories:', this.selectedCategories);
      } else {
        this.selectedCategories = [];
        console.log('No categories found for the selected EventType');
      }
    });
  }
  


  loadEventTypes(): void {
    this.eventTypeService.getAllEventTypes().subscribe(
      (data: EventTypeDTO[]) => {
        this.eventTypes = data;
      },
      (error) => {
        console.error('Error loading event types:', error);
      }
    );
  }

  addPhotoUrl(photoUrl: string): void {
    if (photoUrl.trim()) {
      this.photos.push(photoUrl.trim());
      this.eventForm.patchValue({ photos: this.photos });
    }
  }

  removePhotoUrl(index: number): void {
    this.photos.splice(index, 1);
    this.eventForm.patchValue({ photos: this.photos });
  }

  setVisibility(isPublic: boolean): void {
    this.isPublic = isPublic;
  }


  onSubmit(): void {
    if (this.eventForm.valid) {
      // Формирование данных для отправки
      const eventData = {
        name: this.eventForm.value.name,
        description: this.eventForm.value.description,
        maxParticipants: this.eventForm.value.maxParticipants,
        isPublic: this.isPublic,
        place: this.eventForm.value.place,
        date: this.eventForm.value.date instanceof Date
          ? this.eventForm.value.date.toISOString()
          : this.eventForm.value.date,
        eventType: {
          name: this.eventTypes[this.eventForm.value.eventType].name, // Передаем только имя this.eventForm.value.eventType
        },
        photos: this.photos, // Добавляем массив URL фотографий
        minParticipants: this.eventForm.value.minParticipants || 0,
        disabled: this.eventForm.value.disabled || false,
      };
  
      console.log('Prepared Event Data:', eventData);
  
      // Отправка данных на сервер
      this.eventService.createEvent(eventData).subscribe(
        (response) => {
          this.router.navigate([`my_events`]);
          console.log('Event created successfully:', response);
          
        },
        (error) => {
          console.error('Error creating event:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
