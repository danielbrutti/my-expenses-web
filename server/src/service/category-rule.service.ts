import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CategoryRuleDTO } from '../service/dto/category-rule.dto';
import { CategoryRuleMapper } from '../service/mapper/category-rule.mapper';
import { CategoryRuleRepository } from '../repository/category-rule.repository';

const relationshipNames = [];

@Injectable()
export class CategoryRuleService {
    logger = new Logger('CategoryRuleService');

    constructor(@InjectRepository(CategoryRuleRepository) private categoryRuleRepository: CategoryRuleRepository) {}

    async findById(id: number): Promise<CategoryRuleDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.categoryRuleRepository.findOne(id, options);
        return CategoryRuleMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<CategoryRuleDTO>): Promise<CategoryRuleDTO | undefined> {
        const result = await this.categoryRuleRepository.findOne(options);
        return CategoryRuleMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<CategoryRuleDTO>): Promise<[CategoryRuleDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.categoryRuleRepository.findAndCount(options);
        const categoryRuleDTO: CategoryRuleDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((categoryRule) =>
                categoryRuleDTO.push(CategoryRuleMapper.fromEntityToDTO(categoryRule)),
            );
            resultList[0] = categoryRuleDTO;
        }
        return resultList;
    }

    async save(categoryRuleDTO: CategoryRuleDTO, creator?: string): Promise<CategoryRuleDTO | undefined> {
        const entity = CategoryRuleMapper.fromDTOtoEntity(categoryRuleDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.categoryRuleRepository.save(entity);
        return CategoryRuleMapper.fromEntityToDTO(result);
    }

    async update(categoryRuleDTO: CategoryRuleDTO, updater?: string): Promise<CategoryRuleDTO | undefined> {
        const entity = CategoryRuleMapper.fromDTOtoEntity(categoryRuleDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.categoryRuleRepository.save(entity);
        return CategoryRuleMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.categoryRuleRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
