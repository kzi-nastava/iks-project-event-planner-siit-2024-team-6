import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderOfferCardComponent } from './provider-offer-card.component';

describe('ProviderOfferCardComponent', () => {
  let component: ProviderOfferCardComponent;
  let fixture: ComponentFixture<ProviderOfferCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderOfferCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderOfferCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
