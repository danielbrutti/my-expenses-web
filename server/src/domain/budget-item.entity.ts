/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Budget } from './budget.entity';
import { Category } from './category.entity';

/**
 * A BudgetItem.
 */
@Entity('budget_item')
export class BudgetItem extends BaseEntity {
    @Column({ type: 'decimal', name: 'amount', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne((type) => Budget)
    budget: Budget;

    @ManyToOne((type) => Category)
    category: Category;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
