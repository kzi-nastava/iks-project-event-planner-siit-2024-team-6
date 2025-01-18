import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderProductEditComponent } from './provider-product-edit.component';

describe('ProviderProductEditComponent', () => {
  let component: ProviderProductEditComponent;
  let fixture: ComponentFixture<ProviderProductEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderProductEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
