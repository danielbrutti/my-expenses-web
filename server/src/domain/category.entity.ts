/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { CategoryType } from './enumeration/category-type';

/**
 * A Category.
 */
@Entity('category')
export class Category extends BaseEntity {
    @Column({ name: 'category_name', nullable: true })
    categoryName: string;

    @Column({ type: 'simple-enum', name: 'category_type', enum: CategoryType })
    categoryType: CategoryType;

    @Column({ name: 'notes', nullable: true })
    notes: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
