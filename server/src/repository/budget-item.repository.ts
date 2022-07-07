import { EntityRepository, Repository } from 'typeorm';
import { BudgetItem } from '../domain/budget-item.entity';

@EntityRepository(BudgetItem)
export class BudgetItemRepository extends Repository<BudgetItem> {}
