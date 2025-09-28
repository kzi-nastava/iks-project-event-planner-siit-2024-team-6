import { Component, OnInit } from '@angular/core';
import { ActivityService, Activity } from '../activity.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  activities: Activity[] = [];
  eventId: number; // Пример ID события, замените на динамический

  constructor(private activityService: ActivityService,
     private route: ActivatedRoute,
     private router: Router) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getActivities(this.eventId).subscribe({
      next: (data) => this.activities = data,
      error: (err) => console.error(err)
    });
  }

  deleteActivity(activityId: number): void {
    this.activityService.deleteActivity(this.eventId, activityId).subscribe({
      next: () => this.loadActivities(),
      error: (err) => console.error(err)
    });
  }

  navigateToAddActivity(): void {
    this.router.navigate([`/event/${this.eventId}/add-activity`]);
  }

  navigateToEditActivity(activityId: number): void {
    this.router.navigate([`/event/${this.eventId}/edit-activity`, activityId]);
  }
}
