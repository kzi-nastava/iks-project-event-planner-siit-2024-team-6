import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProductFilterComponent } from './provider-product-filter.component';

describe('ProviderProductFilterComponent', () => {
  let component: ProviderProductFilterComponent;
  let fixture: ComponentFixture<ProviderProductFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderProductFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderProductFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
