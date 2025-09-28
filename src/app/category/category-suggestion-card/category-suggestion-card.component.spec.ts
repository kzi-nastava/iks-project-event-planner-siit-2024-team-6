import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySuggestionCardComponent } from './category-suggestion-card.component';

describe('CategorySuggestionCardComponent', () => {
  let component: CategorySuggestionCardComponent;
  let fixture: ComponentFixture<CategorySuggestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorySuggestionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySuggestionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
