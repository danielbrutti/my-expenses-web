import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BudgetDTO } from '../service/dto/budget.dto';
import { BudgetMapper } from '../service/mapper/budget.mapper';
import { BudgetRepository } from '../repository/budget.repository';

const relationshipNames = [];

@Injectable()
export class BudgetService {
    logger = new Logger('BudgetService');

    constructor(@InjectRepository(BudgetRepository) private budgetRepository: BudgetRepository) {}

    async findById(id: number): Promise<BudgetDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.budgetRepository.findOne(id, options);
        return BudgetMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<BudgetDTO>): Promise<BudgetDTO | undefined> {
        const result = await this.budgetRepository.findOne(options);
        return BudgetMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<BudgetDTO>): Promise<[BudgetDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.budgetRepository.findAndCount(options);
        const budgetDTO: BudgetDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((budget) => budgetDTO.push(BudgetMapper.fromEntityToDTO(budget)));
            resultList[0] = budgetDTO;
        }
        return resultList;
    }

    async save(budgetDTO: BudgetDTO, creator?: string): Promise<BudgetDTO | undefined> {
        const entity = BudgetMapper.fromDTOtoEntity(budgetDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.budgetRepository.save(entity);
        return BudgetMapper.fromEntityToDTO(result);
    }

    async update(budgetDTO: BudgetDTO, updater?: string): Promise<BudgetDTO | undefined> {
        const entity = BudgetMapper.fromDTOtoEntity(budgetDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.budgetRepository.save(entity);
        return BudgetMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.budgetRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
