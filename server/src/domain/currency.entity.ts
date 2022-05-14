/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Currency.
 */
@Entity('currency')
export class Currency extends BaseEntity {
    @Column({ name: 'currency_name', nullable: true })
    currencyName: string;

    @Column({ name: 'symbol', nullable: true })
    symbol: string;

    @Column({ type: 'decimal', name: 'usd_price', precision: 10, scale: 2, nullable: true })
    usdPrice: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
