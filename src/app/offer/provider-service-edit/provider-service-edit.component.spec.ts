import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServiceEditComponent } from './provider-service-edit.component';

describe('ProviderServiceEditComponent', () => {
  let component: ProviderServiceEditComponent;
  let fixture: ComponentFixture<ProviderServiceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderServiceEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderServiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
