import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BudgetItemDTO } from '../service/dto/budget-item.dto';
import { BudgetItemMapper } from '../service/mapper/budget-item.mapper';
import { BudgetItemRepository } from '../repository/budget-item.repository';

const relationshipNames = [];
relationshipNames.push('budget');
relationshipNames.push('category');

@Injectable()
export class BudgetItemService {
    logger = new Logger('BudgetItemService');

    constructor(@InjectRepository(BudgetItemRepository) private budgetItemRepository: BudgetItemRepository) {}

    async findById(id: number): Promise<BudgetItemDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.budgetItemRepository.findOne(id, options);
        return BudgetItemMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<BudgetItemDTO>): Promise<BudgetItemDTO | undefined> {
        const result = await this.budgetItemRepository.findOne(options);
        return BudgetItemMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<BudgetItemDTO>): Promise<[BudgetItemDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.budgetItemRepository.findAndCount(options);
        const budgetItemDTO: BudgetItemDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((budgetItem) => budgetItemDTO.push(BudgetItemMapper.fromEntityToDTO(budgetItem)));
            resultList[0] = budgetItemDTO;
        }
        return resultList;
    }

    async save(budgetItemDTO: BudgetItemDTO, creator?: string): Promise<BudgetItemDTO | undefined> {
        const entity = BudgetItemMapper.fromDTOtoEntity(budgetItemDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.budgetItemRepository.save(entity);
        return BudgetItemMapper.fromEntityToDTO(result);
    }

    async update(budgetItemDTO: BudgetItemDTO, updater?: string): Promise<BudgetItemDTO | undefined> {
        const entity = BudgetItemMapper.fromDTOtoEntity(budgetItemDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.budgetItemRepository.save(entity);
        return BudgetItemMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.budgetItemRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
