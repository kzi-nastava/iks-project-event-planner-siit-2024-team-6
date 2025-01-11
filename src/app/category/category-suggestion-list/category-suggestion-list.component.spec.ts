import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySuggestionListComponent } from './category-suggestion-list.component';

describe('CategorySuggestionListComponent', () => {
  let component: CategorySuggestionListComponent;
  let fixture: ComponentFixture<CategorySuggestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategorySuggestionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySuggestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
