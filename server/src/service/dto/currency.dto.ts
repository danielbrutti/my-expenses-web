/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A CurrencyDTO object.
 */
export class CurrencyDTO extends BaseDTO {
    @ApiModelProperty({ description: 'currencyName field', required: false })
    currencyName: string;

    @ApiModelProperty({ description: 'symbol field', required: false })
    symbol: string;

    @ApiModelProperty({ description: 'usdPrice field', required: false })
    usdPrice: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
