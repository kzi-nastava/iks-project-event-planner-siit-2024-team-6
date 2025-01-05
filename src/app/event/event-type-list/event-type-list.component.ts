import { Component, OnInit } from '@angular/core';
import { EventTypeService, EventTypeDTO } from '../event-type.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.css'],
})
export class EventTypeListComponent implements OnInit {

  eventTypes: EventTypeDTO[] = [];
  editingEventType: EventTypeDTO | null = null;
  allCategories: { id: number; name: string }[] = []; // Все категории { id: number; name: string }[] = [];
  selectedCategoryId: number | null = null; // Выбранная для добавления категория

  constructor(private http: HttpClient, private eventTypeService: EventTypeService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadEventTypes();
  }
  addNewEventType() {
    this.router.navigate(['/event-types/add']);
    }
    loadAllCategories(): void {
      this.http.get<{ id: number; name: string }[]>('/api/admins/categories').subscribe({
        next: (data) => {
          this.allCategories = data;
          console.log('Loaded categories:', this.allCategories);
        },
        error: (err) => {
          console.error('Failed to load categories:', err);
        }
      });
    }
    

  loadEventTypes(): void {
    this.eventTypeService.getAllEventTypes().subscribe((data) => {
      this.eventTypes = data;
    });
  }

  removeCategory(category: { id: number; name: string }): void {
    if (!this.editingEventType || !this.editingEventType.categories) {
      console.error('No event type or categories available');
      return; // Если `editingEventType` или `categories` пусты, ничего не делаем
    }
  
    const initialLength = this.editingEventType.categories.length;
  
    this.editingEventType.categories = this.editingEventType.categories.filter(
      (c: any) => c.id !== category.id
    );
  
    if (this.editingEventType.categories.length < initialLength) {
      console.log('Category removed:', category);
    } else {
      console.warn('Category not found:', category);
    }
  }

  addCategory(): void {
    console.error('No zzz selected');
    if (this.selectedCategoryId === null) {
      console.error('No category selected');
      return;
    }
    console.error('No category11 selected');
    const categoryToAdd = this.allCategories.find(
      (c) => c.id === +this.selectedCategoryId
    );
    console.error('No category22 selected');
    if (!categoryToAdd) {
      console.error('Category not found in allCategories:', this.allCategories);
      return;
    }
    console.error('No category333 selected');
    if (
      !this.editingEventType.categories.some((c: any) => c.id === categoryToAdd.id)
    ) {
      this.editingEventType.categories.push({ ...categoryToAdd }); // Добавляем весь объект
      console.log('Category added:', categoryToAdd);
    } else {
      console.warn('Category already exists');
    }
  
    this.selectedCategoryId = null; // Сбросить выбор
  }
  

  
  saveChanges(): void {
    const updatedEventType = {
      ...this.editingEventType,
      categories: this.editingEventType.categories // Передаём категории как есть
    };
  
    console.log('Data to be sent to the server:', updatedEventType);
  
    this.http.put(`/api/admins/event-types/${updatedEventType.id}`, updatedEventType).subscribe({
      next: () => {
        console.log('Event type updated successfully');
        this.editingEventType = null;
        this.loadEventTypes();
      },
      error: (err) => {
        console.error('Failed to update event type:', err);
      }
    });
  }
  
  

  startEditing(eventType: EventTypeDTO): void {
    this.editingEventType = {
      ...eventType,
      categories: [...(eventType.categories || [])] // Создаём новый массив категорий
    };
    console.log('Editing event type:', this.editingEventType);
  }
  
  
  cancelEditing(): void {
    this.editingEventType = null;
  }
  deleteEventType(id: number): void {
    if (!id) {
      console.error('Invalid ID for deletion:', id);
      return; // Не выполняем запрос, если ID некорректен
    }
  
    this.http.put(`/api/admins/event-types/${id}/change-status`, "d").subscribe({
      next: () => {
        console.log(`Event type with ID ${id} deleted successfully`);
        this.eventTypes = this.eventTypes.filter(event => event.id !== id);
      },
      error: (err) => {
        console.error('Failed to delete event type:', err); 
      }
    });
    this.loadEventTypes();
  }

}