import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventViewOrgaizerComponent } from './event-view-orgaizer.component';

describe('EventViewOrgaizerComponent', () => {
  let component: EventViewOrgaizerComponent;
  let fixture: ComponentFixture<EventViewOrgaizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventViewOrgaizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventViewOrgaizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
