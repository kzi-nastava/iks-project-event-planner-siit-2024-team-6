import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionEditDialogComponent } from './suggestion-edit-dialog.component';

describe('SuggestionEditDialogComponent', () => {
  let component: SuggestionEditDialogComponent;
  let fixture: ComponentFixture<SuggestionEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuggestionEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
