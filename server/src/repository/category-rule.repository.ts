import { EntityRepository, Repository } from 'typeorm';
import { CategoryRule } from '../domain/category-rule.entity';

@EntityRepository(CategoryRule)
export class CategoryRuleRepository extends Repository<CategoryRule> {}
