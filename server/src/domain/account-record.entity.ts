/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Category } from './category.entity';
import { MoneyAccount } from './money-account.entity';
import { AccountRecordType } from './enumeration/account-record-type';

/**
 * A AccountRecord.
 */
@Entity('account_record')
export class AccountRecord extends BaseEntity {
    @Column({ type: 'date', name: 'date', nullable: true })
    date: any;

    @Column({ type: 'decimal', name: 'amount', precision: 10, scale: 2, nullable: true })
    amount: number;

    @Column({ type: 'simple-enum', name: 'type', enum: AccountRecordType })
    type: AccountRecordType;

    @ManyToOne((type) => Category)
    category: Category;

    @ManyToOne((type) => MoneyAccount)
    account: MoneyAccount;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
