import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProductFormComponent } from './provider-product-form.component';

describe('ProviderProductFormComponent', () => {
  let component: ProviderProductFormComponent;
  let fixture: ComponentFixture<ProviderProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderProductFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
