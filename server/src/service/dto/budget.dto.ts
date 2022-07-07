/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A BudgetDTO object.
 */
export class BudgetDTO extends BaseDTO {
    @ApiModelProperty({ description: 'yearMonth field', required: false })
    yearMonth: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'date field' })
    date: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
