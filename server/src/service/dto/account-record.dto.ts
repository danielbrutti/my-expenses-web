/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { CategoryDTO } from './category.dto';
import { MoneyAccountDTO } from './money-account.dto';
import { AccountRecordType } from '../../domain/enumeration/account-record-type';

/**
 * A AccountRecordDTO object.
 */
export class AccountRecordDTO extends BaseDTO {
    @ApiModelProperty({ description: 'date field', required: false })
    date: any;

    @ApiModelProperty({ description: 'amount field', required: false })
    amount: number;

    @ApiModelProperty({ enum: AccountRecordType, description: 'type enum field', required: false })
    type: AccountRecordType;

    @ApiModelProperty({ type: CategoryDTO, description: 'category relationship' })
    category: CategoryDTO;

    @ApiModelProperty({ type: MoneyAccountDTO, description: 'account relationship' })
    account: MoneyAccountDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
