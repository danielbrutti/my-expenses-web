/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Budget.
 */
@Entity('budget')
export class Budget extends BaseEntity {
    @Column({ name: 'jhi_year_month', nullable: true })
    yearMonth: string;

    @Column({ type: 'date', name: 'date' })
    date: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
