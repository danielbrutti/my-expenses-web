/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { CategoryDTO } from './category.dto';

/**
 * A CategoryRuleDTO object.
 */
export class CategoryRuleDTO extends BaseDTO {
    @ApiModelProperty({ description: 'match field', required: false })
    match: string;

    @ApiModelProperty({ type: CategoryDTO, description: 'category relationship' })
    category: CategoryDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
