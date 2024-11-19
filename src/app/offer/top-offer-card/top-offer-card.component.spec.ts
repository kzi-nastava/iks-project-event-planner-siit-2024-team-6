import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOfferCardComponent } from './top-offer-card.component';

describe('TopOfferCardComponent', () => {
  let component: TopOfferCardComponent;
  let fixture: ComponentFixture<TopOfferCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopOfferCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopOfferCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
