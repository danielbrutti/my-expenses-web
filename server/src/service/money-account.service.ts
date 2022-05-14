import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { MoneyAccountDTO } from '../service/dto/money-account.dto';
import { MoneyAccountMapper } from '../service/mapper/money-account.mapper';
import { MoneyAccountRepository } from '../repository/money-account.repository';

const relationshipNames = [];
relationshipNames.push('currency');

@Injectable()
export class MoneyAccountService {
    logger = new Logger('MoneyAccountService');

    constructor(@InjectRepository(MoneyAccountRepository) private moneyAccountRepository: MoneyAccountRepository) {}

    async findById(id: number): Promise<MoneyAccountDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.moneyAccountRepository.findOne(id, options);
        return MoneyAccountMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<MoneyAccountDTO>): Promise<MoneyAccountDTO | undefined> {
        const result = await this.moneyAccountRepository.findOne(options);
        return MoneyAccountMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<MoneyAccountDTO>): Promise<[MoneyAccountDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.moneyAccountRepository.findAndCount(options);
        const moneyAccountDTO: MoneyAccountDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((moneyAccount) =>
                moneyAccountDTO.push(MoneyAccountMapper.fromEntityToDTO(moneyAccount)),
            );
            resultList[0] = moneyAccountDTO;
        }
        return resultList;
    }

    async save(moneyAccountDTO: MoneyAccountDTO, creator?: string): Promise<MoneyAccountDTO | undefined> {
        const entity = MoneyAccountMapper.fromDTOtoEntity(moneyAccountDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.moneyAccountRepository.save(entity);
        return MoneyAccountMapper.fromEntityToDTO(result);
    }

    async update(moneyAccountDTO: MoneyAccountDTO, updater?: string): Promise<MoneyAccountDTO | undefined> {
        const entity = MoneyAccountMapper.fromDTOtoEntity(moneyAccountDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.moneyAccountRepository.save(entity);
        return MoneyAccountMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.moneyAccountRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
