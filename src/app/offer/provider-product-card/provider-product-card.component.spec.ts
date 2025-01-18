import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProductCardComponent } from './provider-product-card.component';

describe('ProviderProductCardComponent', () => {
  let component: ProviderProductCardComponent;
  let fixture: ComponentFixture<ProviderProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
