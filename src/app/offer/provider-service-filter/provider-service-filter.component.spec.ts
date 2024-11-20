import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServiceFilterComponent } from './provider-service-filter.component';

describe('ProviderServiceFilterComponent', () => {
  let component: ProviderServiceFilterComponent;
  let fixture: ComponentFixture<ProviderServiceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderServiceFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderServiceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
