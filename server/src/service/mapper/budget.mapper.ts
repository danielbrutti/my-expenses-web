import { Budget } from '../../domain/budget.entity';
import { BudgetDTO } from '../dto/budget.dto';

/**
 * A Budget mapper object.
 */
export class BudgetMapper {
    static fromDTOtoEntity(entityDTO: BudgetDTO): Budget {
        if (!entityDTO) {
            return;
        }
        let entity = new Budget();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Budget): BudgetDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new BudgetDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
