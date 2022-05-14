import { Currency } from '../../domain/currency.entity';
import { CurrencyDTO } from '../dto/currency.dto';

/**
 * A Currency mapper object.
 */
export class CurrencyMapper {
    static fromDTOtoEntity(entityDTO: CurrencyDTO): Currency {
        if (!entityDTO) {
            return;
        }
        let entity = new Currency();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Currency): CurrencyDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new CurrencyDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
