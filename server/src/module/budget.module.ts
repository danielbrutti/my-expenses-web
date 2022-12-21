import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from '../web/rest/budget.controller';
import { BudgetRepository } from '../repository/budget.repository';
import { BudgetService } from '../service/budget.service';
import { BudgetItemModule } from './budget-item.module';

@Module({
    imports: [TypeOrmModule.forFeature([BudgetRepository]), BudgetItemModule],
    controllers: [BudgetController],
    providers: [BudgetService],
    exports: [BudgetService],
})
export class BudgetModule {}
