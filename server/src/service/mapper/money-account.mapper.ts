import { MoneyAccount } from '../../domain/money-account.entity';
import { MoneyAccountDTO } from '../dto/money-account.dto';

/**
 * A MoneyAccount mapper object.
 */
export class MoneyAccountMapper {
    static fromDTOtoEntity(entityDTO: MoneyAccountDTO): MoneyAccount {
        if (!entityDTO) {
            return;
        }
        let entity = new MoneyAccount();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: MoneyAccount): MoneyAccountDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new MoneyAccountDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
