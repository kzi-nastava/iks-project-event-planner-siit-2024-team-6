import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../../event/event.service';
import { FormControl, Validators } from '@angular/forms';
import { OrganizersEventDTO } from '../../../dto/event-dtos';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buy-dialog',
  templateUrl: './buy-dialog.component.html',
  styleUrl: './buy-dialog.component.css'
})
export class BuyDialogComponent implements OnInit{
  events: OrganizersEventDTO[] = [];
  selectedEvent = new FormControl<number | null>(null, Validators.required);
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<BuyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public productId: number,
    private eventService: EventService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchEvents().subscribe({
      next: (events) => {
        this.events = events; // No conversion of `date`
        this.loading = false; 
      },
      error: (error) => {
        console.error('Failed to fetch events:', error);
        this.loading = false; 
      }
    });
  }
  fetchEvents(): Observable<OrganizersEventDTO[]> {
      return this.http.get<OrganizersEventDTO[]>(`/api/organizers/future-events`);
  }

  confirm(): void {
    if (this.selectedEvent.valid) {
      this.dialogRef.close(this.selectedEvent.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
