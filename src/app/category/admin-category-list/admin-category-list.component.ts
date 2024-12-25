import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Category } from '../model/category.model';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { PagedResponse } from '../../shared/model/paged-response.model';

@Component({
  selector: 'app-admin-category-list',
  templateUrl: './admin-category-list.component.html',
  styleUrls: ['./admin-category-list.component.css']
})
export class AdminCategoryListComponent {
  categories: Category[] = [];

  pageProperties = {
    page: 0,
    pageSize: 8,
    totalCount: 0,
    pageSizeOptions: [4, 8, 12],
  };

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.getPagedCategories();
  }

  pageChanged(pageEvent: PageEvent): void {
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedCategories();
  }

  private getPagedCategories(): void {
    this.categoryService.getPagedCategories(this.pageProperties.page, this.pageProperties.pageSize).subscribe({next: (response: PagedResponse<Category>)=>{
      this.categories = response.content;
      console.log("kategorije"+this.categories);
      this.pageProperties.totalCount = response.totalElements;
      console.log("fetch"+response);
    },
      error: (err) => console.error(err),});
  }

  onAddClick(): void {
    //this.router.navigate(['/service-form']);
  }
  removeCategoryFromList(id: number): void {
    this.categories = this.categories.filter(category => category.id !== id);
  }  
}
