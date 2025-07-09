export interface NewBudgetDTO {
    budgetItems: BudgetItemDTO[];
  }

interface BudgetItemDTO {
    maxPrice: number;
    currPrice: number;
    category: string;
  }

  export interface NewBudgetItemDTO {
    maxPrice: number;
    category: string;
  }