import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopEventCardComponent } from './top-event-card.component';

describe('TopEventCardComponent', () => {
  let component: TopEventCardComponent;
  let fixture: ComponentFixture<TopEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopEventCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
