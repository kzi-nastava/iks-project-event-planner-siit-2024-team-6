import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServiceViewComponent } from './provider-service-view.component';

describe('ProviderServiceViewComponent', () => {
  let component: ProviderServiceViewComponent;
  let fixture: ComponentFixture<ProviderServiceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderServiceViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderServiceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
