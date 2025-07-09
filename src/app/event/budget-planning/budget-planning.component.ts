import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Budget, BudgetItem } from '../model/event.model'
import { EventService } from '../event.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../category/category.service';
import { NewBudgetDTO } from '../../dto/budget-dtos';
import { Offer } from '../../offer/model/offer.model';
import { OfferService } from '../../offer/offer.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PagedResponse } from '../../shared/model/paged-response.model';
@Component({
  selector: 'app-budget-planning',
  templateUrl: './budget-planning.component.html',
  styleUrl: './budget-planning.component.css'
})
export class BudgetPlanningComponent {
  eventId!: string;
  filteredOffers: Offer[] = [];
  budget: Budget;
  recommendedCategories: string[];
  selectedRecomendations: Set<string> = new Set();

  popupVisible = false;
  editPopupVisible = false;
  createPopupVisible = false;
  categories: string[] = null;
  selectedCategory = '';
  enteredMaxAmount: number = 0;
  savedCurrPrice: number = 0;
  totalSpent: number = 0;

  pageProperties = {
    page: 0,
    pageSize: 8,
    totalCount: 0,
    pageSizeOptions: [4, 8, 12]
  };

  constructor(private router: Router, private categoryService: CategoryService, private route: ActivatedRoute, private eventService: EventService, private dialog: MatDialog, private snackBar: MatSnackBar, private offerService: OfferService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId')
    this.fetchRecommendedCategories();
    this.fetchAllCategories();
    this.eventService.getBudgetByEventId(Number(this.eventId)).subscribe((budget) => {
      if (budget) {
        this.budget = budget;
        this.totalSpent = this.budget.total - this.budget.left;
      } else {
        console.error('Budget not found');
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/event', this.eventId, 'organizer-page']);
  }

  openCreateItemPopup(): void {
    this.enteredMaxAmount = null;
    this.createPopupVisible = true;
  }

  openPopup(category: string): void {
    this.selectedCategory = category;
    this.enteredMaxAmount = null;
    this.popupVisible = true;
  }

  openEditPopup(item: BudgetItem): void {
    this.selectedCategory = item.category;
    this.enteredMaxAmount = item.maxPrice;
    this.savedCurrPrice = item.currPrice;
    this.editPopupVisible = true;
  }

  confirmPopup(): void {
    if (this.selectedCategory && !this.budget.budgetItems.some(item => item.category === this.selectedCategory)) {
      this.addBudgetItem(this.selectedCategory, this.enteredMaxAmount);
      this.closePopup();
      this.snackBar.open('Item created successfully', 'Close', {
        duration: 3000
      });
    } else {
      this.snackBar.open('Please select a non-picked category and enter a valid amount.', 'Close', {
        duration: 3000,
      });
    }
  }

  confirmEditPopup(): void {
    if (this.enteredMaxAmount > 0 && this.enteredMaxAmount >= this.savedCurrPrice) {
      const item = this.budget.budgetItems.find(i => i.category === this.selectedCategory);
      this.editBudgetItem(item.id, this.enteredMaxAmount);
    }
    this.closeEditPopup();
  }

  confirmCreateItemPopup(): void {
    if (this.selectedCategory && !this.budget.budgetItems.some(item => item.category === this.selectedCategory) && this.enteredMaxAmount > 0) {
      this.addBudgetItem(this.selectedCategory, this.enteredMaxAmount);
      this.snackBar.open('Item created successfully', 'Close', {
        duration: 3000
      });
      this.closeCreateItemPopup();
    } else {
      this.snackBar.open('Please select a non-picked category and enter a valid amount.', 'Close', {
        duration: 3000,
      });
    }
  }

  closeCreateItemPopup(): void {
    this.createPopupVisible = false;
    this.selectedCategory = '';
    this.enteredMaxAmount = 0;
    this.savedCurrPrice = 0;
  }

  closeEditPopup(): void {
    this.editPopupVisible = false;
    this.selectedCategory = '';
    this.enteredMaxAmount = 0;
    this.savedCurrPrice = 0;
  }

  closePopup(): void {
    this.popupVisible = false;
    this.selectedCategory = '';
    this.enteredMaxAmount = 0;
  }

  fetchRecommendedCategories(): void {
    this.eventService.getRecommendedCategories(Number(this.eventId)).subscribe({
      next: (categories) => {
        this.recommendedCategories = categories;
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      }
    });
  }

  fetchAllCategories(): void {
    this.categoryService.getAllCategoriesOrganizer().subscribe({
      next: (categories) => {
        console.log(categories);
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      }
    });
  }

  onEdit(item: BudgetItem): void {
    this.openEditPopup(item);
  }

  onDelete(item: BudgetItem): void {
    if (item.currPrice > 0) {
      this.snackBar.open('Offers have been purchased for this budget item. Delete unavailable.', 'Close', {
        duration: 3000,
      });
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { question: 'Are you sure you want to delete this budget item? ' + item.category }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User confirmed the action');
        this.eventService.deleteBudgetItem(this.budget.id, item.id).subscribe({
          next: () => {
            console.log('Item deleted successfully');
            this.budget.budgetItems = this.budget.budgetItems.filter(i => i.id !== item.id);
            this.recalculateBudget();
            this.snackBar.open('Item deleted successfully', 'Close', {
              duration: 3000
            });
          },
          error: (err) => {
            console.error('Failed to delete item', err);
            this.snackBar.open('Failed to delete item: ' + this.extractErrorMessage(err), 'Close', {
              duration: 3000
            });
          }
        });
      } else {
        console.log('User cancelled the action');
      }
    });
  }

  onSearch(): void {
    const params = {
      ...this.pageProperties
    };
    const dto = this.toNewBudgetDTO(this.budget);
    // Replace with your actual filtering logic based on budget items or user input
    this.offerService.getFilteredOffersByBudget(dto, params).subscribe({
      next: (response: PagedResponse<Offer> | null) => {
        if (response && response.content) {
          this.filteredOffers = response.content;
          console.log(this.filteredOffers);
          this.pageProperties.totalCount = response.totalElements;
          console.log('Paged and filtered offers:', response);
        } else {
          this.filteredOffers = [];
          this.pageProperties.totalCount = 0;
          console.warn('No offers found or response is null');
        }
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
        this.filteredOffers = [];
        this.pageProperties.totalCount = 0;
      }
    });
  }

  pageChanged(pageEvent: PageEvent) {
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.onSearch();
  }

  private recalculateBudget(): void {
    this.budget.total = this.budget.budgetItems.reduce((sum, item) => sum + item.maxPrice, 0);
    const totalCurrPrice = this.budget.budgetItems.reduce((sum, item) => sum + item.currPrice, 0);
    this.budget.left = this.budget.total - totalCurrPrice;
    this.totalSpent = totalCurrPrice;
  }

  private addBudgetItem(c: string, mp: number): void {
    const dto = { category: c, maxPrice: mp }
    this.eventService.addBudgetItem(this.budget.id, dto).subscribe({
      next: (created) => {
        this.budget.budgetItems.push(created);
        this.recalculateBudget();
      },
      error: (err) => {
        this.snackBar.open('Failed to create budget item: ' + this.extractErrorMessage(err), 'Close', {
          duration: 3000
        });
      }
    });
  }

  private editBudgetItem(itemId: number, price: number): void {
    this.eventService.updateBudgetItemPrice(this.budget.id, itemId, price).subscribe({
      next: (updatedItem) => {
        console.log('Updated item:', updatedItem);
        this.budget.budgetItems = this.budget.budgetItems.filter(i => i.id !== updatedItem.id);
        this.budget.budgetItems.push({
          id: updatedItem.id,
          category: updatedItem.category,
          maxPrice: updatedItem.maxPrice,
          currPrice: updatedItem.currPrice
        });
        this.recalculateBudget();
        this.snackBar.open('Item updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Failed to update item', err);
        this.snackBar.open('Failed to update budget item: ' + this.extractErrorMessage(err), 'Close', {
          duration: 3000
        });
      }
    });
  }

  private toNewBudgetDTO(budget: Budget): NewBudgetDTO {
    return {
      budgetItems: budget.budgetItems.map(item => ({
        category: item.category, // or item.category.name if it's an object
        maxPrice: item.maxPrice,
        currPrice: item.currPrice
      }))
    };
  }

  extractErrorMessage(error: any): string {
    if (typeof error?.error === 'string') return error.error;
    if (error?.error?.message) return error.error.message;
    return 'Unexpected error occurred.';
  }

}
