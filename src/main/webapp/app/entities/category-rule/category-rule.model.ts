import { ICategory } from 'app/entities/category/category.model';

export interface ICategoryRule {
  id?: number;
  match?: string | null;
  category?: ICategory | null;
}

export class CategoryRule implements ICategoryRule {
  constructor(public id?: number, public match?: string | null, public category?: ICategory | null) {}
}

export function getCategoryRuleIdentifier(categoryRule: ICategoryRule): number | undefined {
  return categoryRule.id;
}
