import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProductViewComponent } from './provider-product-view.component';

describe('ProviderProductViewComponent', () => {
  let component: ProviderProductViewComponent;
  let fixture: ComponentFixture<ProviderProductViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderProductViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderProductViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
