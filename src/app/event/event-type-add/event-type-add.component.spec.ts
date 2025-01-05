import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeAddComponent } from './event-type-add.component';

describe('EventTypeAddComponent', () => {
  let component: EventTypeAddComponent;
  let fixture: ComponentFixture<EventTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventTypeAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
