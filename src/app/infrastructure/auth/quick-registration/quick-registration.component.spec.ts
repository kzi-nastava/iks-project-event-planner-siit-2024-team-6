import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickRegistrationComponent } from './quick-registration.component';

describe('QuickRegistrationComponent', () => {
  let component: QuickRegistrationComponent;
  let fixture: ComponentFixture<QuickRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
