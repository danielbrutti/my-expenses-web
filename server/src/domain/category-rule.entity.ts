/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Category } from './category.entity';

/**
 * A CategoryRule.
 */
@Entity('category_rule')
export class CategoryRule extends BaseEntity {
    @Column({ name: 'jhi_match', nullable: true })
    match: string;

    @OneToOne((type) => Category)
    @JoinColumn()
    category: Category;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
