import { IBudget } from 'app/entities/budget/budget.model';
import { ICategory } from 'app/entities/category/category.model';

export interface IBudgetItem {
  id?: number;
  amount?: number;
  budget?: IBudget;
  category?: ICategory;
}

export class BudgetItem implements IBudgetItem {
  constructor(public id?: number, public amount?: number, public budget?: IBudget, public category?: ICategory) {}
}

export function getBudgetItemIdentifier(budgetItem: IBudgetItem): number | undefined {
  return budgetItem.id;
}
