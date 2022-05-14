/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { AccountRecord } from './account-record.entity';
import { Currency } from './currency.entity';
import { AccountType } from './enumeration/account-type';

/**
 * A MoneyAccount.
 */
@Entity('money_account')
export class MoneyAccount extends BaseEntity {
    @Column({ name: 'account_name', nullable: true })
    accountName: string;

    @Column({ type: 'decimal', name: 'initial_balance', precision: 10, scale: 2, nullable: true })
    initialBalance: number;

    @Column({ type: 'simple-enum', name: 'account_type', enum: AccountType })
    accountType: AccountType;

    @OneToMany((type) => AccountRecord, (other) => other.account)
    accountRecords: AccountRecord[];

    @ManyToOne((type) => Currency)
    currency: Currency;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
