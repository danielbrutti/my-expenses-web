/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { AccountRecordDTO } from './account-record.dto';
import { CurrencyDTO } from './currency.dto';
import { AccountType } from '../../domain/enumeration/account-type';

/**
 * A MoneyAccountDTO object.
 */
export class MoneyAccountDTO extends BaseDTO {
    @ApiModelProperty({ description: 'accountName field', required: false })
    accountName: string;

    @ApiModelProperty({ description: 'initialBalance field', required: false })
    initialBalance: number;

    @ApiModelProperty({ enum: AccountType, description: 'accountType enum field', required: false })
    accountType: AccountType;

    @ApiModelProperty({ type: AccountRecordDTO, isArray: true, description: 'accountRecords relationship' })
    accountRecords: AccountRecordDTO[];

    @ApiModelProperty({ type: CurrencyDTO, description: 'currency relationship' })
    currency: CurrencyDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
