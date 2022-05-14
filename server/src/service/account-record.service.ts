import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AccountRecordDTO } from '../service/dto/account-record.dto';
import { AccountRecordMapper } from '../service/mapper/account-record.mapper';
import { AccountRecordRepository } from '../repository/account-record.repository';

const relationshipNames = [];
relationshipNames.push('category');
relationshipNames.push('account');

@Injectable()
export class AccountRecordService {
    logger = new Logger('AccountRecordService');

    constructor(@InjectRepository(AccountRecordRepository) private accountRecordRepository: AccountRecordRepository) {}

    async findById(id: number): Promise<AccountRecordDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.accountRecordRepository.findOne(id, options);
        return AccountRecordMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AccountRecordDTO>): Promise<AccountRecordDTO | undefined> {
        const result = await this.accountRecordRepository.findOne(options);
        return AccountRecordMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AccountRecordDTO>): Promise<[AccountRecordDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.accountRecordRepository.findAndCount(options);
        const accountRecordDTO: AccountRecordDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((accountRecord) =>
                accountRecordDTO.push(AccountRecordMapper.fromEntityToDTO(accountRecord)),
            );
            resultList[0] = accountRecordDTO;
        }
        return resultList;
    }

    async save(accountRecordDTO: AccountRecordDTO, creator?: string): Promise<AccountRecordDTO | undefined> {
        const entity = AccountRecordMapper.fromDTOtoEntity(accountRecordDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.accountRecordRepository.save(entity);
        return AccountRecordMapper.fromEntityToDTO(result);
    }

    async update(accountRecordDTO: AccountRecordDTO, updater?: string): Promise<AccountRecordDTO | undefined> {
        const entity = AccountRecordMapper.fromDTOtoEntity(accountRecordDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.accountRecordRepository.save(entity);
        return AccountRecordMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.accountRecordRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
