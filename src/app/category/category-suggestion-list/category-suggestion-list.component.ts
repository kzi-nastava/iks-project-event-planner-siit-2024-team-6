import { Component } from '@angular/core';
import { CategorySuggestion } from '../model/category.model';
import { CategoryService } from '../category.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { PagedResponse } from '../../shared/model/paged-response.model';

@Component({
  selector: 'app-category-suggestion-list',
  templateUrl: './category-suggestion-list.component.html',
  styleUrl: './category-suggestion-list.component.css'
})
export class CategorySuggestionListComponent {
  suggestions: CategorySuggestion[] = [];

  pageProperties = {
    page: 0,
    pageSize: 8,
    totalCount: 0,
    pageSizeOptions: [4, 8, 12],
  };

  constructor(private categoryService: CategoryService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getPagedCategories();
  }

  pageChanged(pageEvent: PageEvent): void {
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedCategories();
  }

  private getPagedCategories(): void {
    this.categoryService.getPagedSuggestions(this.pageProperties.page, this.pageProperties.pageSize).subscribe({
      next: (response: PagedResponse<CategorySuggestion>) => {
        this.suggestions = response.content;
        console.log("sugestije" + this.suggestions);
        this.pageProperties.totalCount = response.totalElements;
        console.log("fetch" + response);
      },
      error: (err) => console.error(err),
    });
  }

  removeSuggestionFromList(id: number): void {
    this.suggestions = this.suggestions.filter(suggestion => suggestion.id !== id);
  }
}
