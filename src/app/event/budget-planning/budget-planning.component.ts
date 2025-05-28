import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../category/model/category.model';
import { Budget} from '../model/event.model'
import { EventService } from '../event.service';
@Component({
  selector: 'app-budget-planning',
  templateUrl: './budget-planning.component.html',
  styleUrl: './budget-planning.component.css'
})
export class BudgetPlanningComponent {
  eventId!: string;
  budget: Budget;
  recommendedCategories: string[];
  selectedRecomendations: Set<string> = new Set();

  popupVisible = false;
  selectedCategory = '';
  enteredMaxAmount: number = 0;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void{
    this.eventId = this.route.snapshot.paramMap.get('eventId')
    this.fetchCategories();
    this.eventService.getEventById(Number(this.eventId)).subscribe((event) => {
      if(event){
      this.budget = event.budget;
      
      } else {
        console.error('Budget not found');
      }
    });
  }

  openPopup(category: string): void{
    this.selectedCategory = category;
    this.enteredMaxAmount = 0;
    this.popupVisible = true;
  }

  confirmPopup(): void{
    if (this.selectedCategory && !this.budget.items.some(item => item.category === this.selectedCategory)){
      this.budget.items.push({
        category: this.selectedCategory,
        maxPrice: this.enteredMaxAmount,
        currPrice: 0
      });
    }
    this.closePopup();
  }

  closePopup(): void{
    this.popupVisible = false;
    this.selectedCategory = '';
    this.enteredMaxAmount = 0;
  }

  fetchCategories(): void {
    this.eventService.getRecommendedCategories(Number(this.eventId)).subscribe({
      next: (categories) => {
        this.recommendedCategories = categories;
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      }
    });
  }
}
