export interface NewBudgetDTO {
    budgetItems: BudgetItemDTO[];
  }

interface BudgetItemDTO {
    maxPrice: number;
    currPrice: number;
    category: string;
  }