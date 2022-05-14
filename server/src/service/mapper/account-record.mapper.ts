import { AccountRecord } from '../../domain/account-record.entity';
import { AccountRecordDTO } from '../dto/account-record.dto';

/**
 * A AccountRecord mapper object.
 */
export class AccountRecordMapper {
    static fromDTOtoEntity(entityDTO: AccountRecordDTO): AccountRecord {
        if (!entityDTO) {
            return;
        }
        let entity = new AccountRecord();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: AccountRecord): AccountRecordDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new AccountRecordDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
