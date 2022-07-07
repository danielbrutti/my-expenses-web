import { EntityRepository, Repository } from 'typeorm';
import { Budget } from '../domain/budget.entity';

@EntityRepository(Budget)
export class BudgetRepository extends Repository<Budget> {}
