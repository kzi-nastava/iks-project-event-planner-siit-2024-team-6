import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProductListComponent } from './provider-product-list.component';

describe('ProviderProductListComponent', () => {
  let component: ProviderProductListComponent;
  let fixture: ComponentFixture<ProviderProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
