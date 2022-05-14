import { CategoryRule } from '../../domain/category-rule.entity';
import { CategoryRuleDTO } from '../dto/category-rule.dto';

/**
 * A CategoryRule mapper object.
 */
export class CategoryRuleMapper {
    static fromDTOtoEntity(entityDTO: CategoryRuleDTO): CategoryRule {
        if (!entityDTO) {
            return;
        }
        let entity = new CategoryRule();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: CategoryRule): CategoryRuleDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new CategoryRuleDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
