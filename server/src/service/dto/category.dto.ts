/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { CategoryType } from '../../domain/enumeration/category-type';

/**
 * A CategoryDTO object.
 */
export class CategoryDTO extends BaseDTO {
    @ApiModelProperty({ description: 'categoryName field', required: false })
    categoryName: string;

    @ApiModelProperty({ enum: CategoryType, description: 'categoryType enum field', required: false })
    categoryType: CategoryType;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
