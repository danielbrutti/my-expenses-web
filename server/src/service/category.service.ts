import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CategoryDTO } from '../service/dto/category.dto';
import { CategoryMapper } from '../service/mapper/category.mapper';
import { CategoryRepository } from '../repository/category.repository';

const relationshipNames = [];

@Injectable()
export class CategoryService {
    logger = new Logger('CategoryService');

    constructor(@InjectRepository(CategoryRepository) private categoryRepository: CategoryRepository) {}

    async findById(id: number): Promise<CategoryDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.categoryRepository.findOne(id, options);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<CategoryDTO>): Promise<CategoryDTO | undefined> {
        const result = await this.categoryRepository.findOne(options);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<CategoryDTO>): Promise<[CategoryDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.categoryRepository.findAndCount(options);
        const categoryDTO: CategoryDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((category) => categoryDTO.push(CategoryMapper.fromEntityToDTO(category)));
            resultList[0] = categoryDTO;
        }
        return resultList;
    }

    async save(categoryDTO: CategoryDTO, creator?: string): Promise<CategoryDTO | undefined> {
        const entity = CategoryMapper.fromDTOtoEntity(categoryDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.categoryRepository.save(entity);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async update(categoryDTO: CategoryDTO, updater?: string): Promise<CategoryDTO | undefined> {
        const entity = CategoryMapper.fromDTOtoEntity(categoryDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.categoryRepository.save(entity);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.categoryRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
