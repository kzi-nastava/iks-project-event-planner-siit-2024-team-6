import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService, Activity } from '../activity.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {
  activity: Activity = {
    name: '',
    description: '',
    location: '',
    startTime: null,
    endTime: null
  };
  eventId!: number;
  isEdit: boolean = false;

  constructor(
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    const activityId = this.route.snapshot.paramMap.get('activityId');

    if (activityId) {
      this.isEdit = true;
      this.activityService.getActivityById(this.eventId, +activityId).subscribe({
        next: (data) => {
          this.activity = {
            ...data,
            startTime: data.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : null,
            endTime: data.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : null,
          };
        },
        error: (err) => console.error('Failed to load activity', err)
      });
    }
  }

  saveActivity(): void {
    const formattedActivity: Activity = {
      ...this.activity,
      startTime: this.activity.startTime ? this.activity.startTime : null,
      endTime: this.activity.endTime ? this.activity.endTime : null,
    };

    if (this.isEdit) {
      this.activityService.updateActivity(this.eventId, this.activity.id!, formattedActivity).subscribe({
        next: () => this.router.navigate([`/event/${this.eventId}/agenda`]),
        error: (err) => console.error(err)
      });
    } else {
      this.activityService.addActivity(this.eventId, formattedActivity).subscribe({
        next: () => this.router.navigate([`/event/${this.eventId}/agenda`]),
        error: (err) => console.error(err)
      });
    }
  }
  
}
