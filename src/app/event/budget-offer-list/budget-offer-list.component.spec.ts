import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetOfferListComponent } from './budget-offer-list.component';

describe('BudgetOfferListComponent', () => {
  let component: BudgetOfferListComponent;
  let fixture: ComponentFixture<BudgetOfferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetOfferListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetOfferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
