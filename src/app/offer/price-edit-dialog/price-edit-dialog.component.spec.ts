import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceEditDialogComponent } from './price-edit-dialog.component';

describe('PriceEditDialogComponent', () => {
  let component: PriceEditDialogComponent;
  let fixture: ComponentFixture<PriceEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriceEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
