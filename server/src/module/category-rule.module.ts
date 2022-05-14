import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRuleController } from '../web/rest/category-rule.controller';
import { CategoryRuleRepository } from '../repository/category-rule.repository';
import { CategoryRuleService } from '../service/category-rule.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryRuleRepository])],
    controllers: [CategoryRuleController],
    providers: [CategoryRuleService],
    exports: [CategoryRuleService],
})
export class CategoryRuleModule {}
