import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarOrganizerComponent } from './sidebar-organizer.component';

describe('SidebarOrganizerComponent', () => {
  let component: SidebarOrganizerComponent;
  let fixture: ComponentFixture<SidebarOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarOrganizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
