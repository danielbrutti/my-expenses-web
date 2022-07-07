import { BudgetItem } from '../../domain/budget-item.entity';
import { BudgetItemDTO } from '../dto/budget-item.dto';

/**
 * A BudgetItem mapper object.
 */
export class BudgetItemMapper {
    static fromDTOtoEntity(entityDTO: BudgetItemDTO): BudgetItem {
        if (!entityDTO) {
            return;
        }
        let entity = new BudgetItem();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: BudgetItem): BudgetItemDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new BudgetItemDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
