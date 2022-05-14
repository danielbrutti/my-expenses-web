import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CurrencyDTO } from '../service/dto/currency.dto';
import { CurrencyMapper } from '../service/mapper/currency.mapper';
import { CurrencyRepository } from '../repository/currency.repository';

const relationshipNames = [];

@Injectable()
export class CurrencyService {
    logger = new Logger('CurrencyService');

    constructor(@InjectRepository(CurrencyRepository) private currencyRepository: CurrencyRepository) {}

    async findById(id: number): Promise<CurrencyDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.currencyRepository.findOne(id, options);
        return CurrencyMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<CurrencyDTO>): Promise<CurrencyDTO | undefined> {
        const result = await this.currencyRepository.findOne(options);
        return CurrencyMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<CurrencyDTO>): Promise<[CurrencyDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.currencyRepository.findAndCount(options);
        const currencyDTO: CurrencyDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((currency) => currencyDTO.push(CurrencyMapper.fromEntityToDTO(currency)));
            resultList[0] = currencyDTO;
        }
        return resultList;
    }

    async save(currencyDTO: CurrencyDTO, creator?: string): Promise<CurrencyDTO | undefined> {
        const entity = CurrencyMapper.fromDTOtoEntity(currencyDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.currencyRepository.save(entity);
        return CurrencyMapper.fromEntityToDTO(result);
    }

    async update(currencyDTO: CurrencyDTO, updater?: string): Promise<CurrencyDTO | undefined> {
        const entity = CurrencyMapper.fromDTOtoEntity(currencyDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.currencyRepository.save(entity);
        return CurrencyMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.currencyRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
