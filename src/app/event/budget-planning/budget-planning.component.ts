import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../category/model/category.model';
import { Budget, BudgetItem } from '../model/event.model'
import { EventService } from '../event.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../category/category.service';
import { NewBudgetDTO } from '../../dto/budget-dtos';
@Component({
  selector: 'app-budget-planning',
  templateUrl: './budget-planning.component.html',
  styleUrl: './budget-planning.component.css'
})
export class BudgetPlanningComponent {
  eventId!: string;
  eventName: string;
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

  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private eventService: EventService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId')
    this.fetchRecommendedCategories();
    this.fetchAllCategories();
    this.eventService.getBudgetByEventId(Number(this.eventId)).subscribe((budget) => {
      if (budget) {
        this.budget = budget;
      } else {
        console.error('Budget not found');
      }
    });
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
      this.budget.budgetItems.push({
        category: this.selectedCategory,
        maxPrice: this.enteredMaxAmount,
        currPrice: 0
      });
    }
    this.recalculateBudget();
    this.updateBudget();
    this.closePopup();
  }

  confirmEditPopup(): void {
    if (this.enteredMaxAmount > 0 && this.enteredMaxAmount >= this.savedCurrPrice) {
      this.budget.budgetItems = this.budget.budgetItems.filter(i => i.category !== this.selectedCategory);
      this.budget.budgetItems.push({
        category: this.selectedCategory,
        maxPrice: this.enteredMaxAmount,
        currPrice: this.savedCurrPrice
      });
      this.recalculateBudget();
      this.updateBudget();
    }
    this.closeEditPopup();
  }

  confirmCreateItemPopup(): void {
    if (this.selectedCategory && this.enteredMaxAmount > 0) {
      const newItem = {
        category: this.selectedCategory,
        maxPrice: this.enteredMaxAmount,
        currPrice: 0,
      };
      this.budget.budgetItems.push(newItem);
      this.recalculateBudget();
      this.closeCreateItemPopup();
      this.updateBudget();
    } else {
      this.snackBar.open('Please select a category and enter a valid amount.', 'Close', {
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
        console.log(categories);
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
        this.budget.budgetItems = this.budget.budgetItems.filter(i => i !== item);
        this.recalculateBudget();
        this.updateBudget();
      } else {
        console.log('User cancelled the action');
      }
    });
  }
  onSearch(): void {

  }
  private recalculateBudget(): void {
    this.budget.total = this.budget.budgetItems.reduce((sum, item) => sum + item.maxPrice, 0);
    this.budget.left = this.budget.total - this.budget.budgetItems.reduce((sum, item) => sum + item.currPrice, 0); // adjust if you subtract used money elsewhere
  }

  private updateBudget(): void {
    const dto = this.toNewBudgetDTO(this.budget);
    this.eventService.updateBudget(this.budget.id, dto).subscribe({
      next: (updated) => {
        this.budget = updated;
        this.snackBar.open('Budget updated successfully!', 'Close', { duration: 3000 });
        this.budget = updated;
      },
      error: () => {
        this.snackBar.open('Failed to update budget.', 'Close', { duration: 3000 });
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
}
