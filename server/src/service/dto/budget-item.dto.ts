/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { BudgetDTO } from './budget.dto';
import { CategoryDTO } from './category.dto';

/**
 * A BudgetItemDTO object.
 */
export class BudgetItemDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'amount field' })
    amount: number;

    @ApiModelProperty({ type: BudgetDTO, description: 'budget relationship' })
    budget: BudgetDTO;

    @ApiModelProperty({ type: CategoryDTO, description: 'category relationship' })
    category: CategoryDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
