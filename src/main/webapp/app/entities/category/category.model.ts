import { CategoryType } from 'app/entities/enumerations/category-type.model';

export interface ICategory {
  id?: number;
  categoryName?: string | null;
  categoryType?: CategoryType | null;
  notes?: string | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public categoryName?: string | null,
    public categoryType?: CategoryType | null,
    public notes?: string | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
