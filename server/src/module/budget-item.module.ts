import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetItemController } from '../web/rest/budget-item.controller';
import { BudgetItemRepository } from '../repository/budget-item.repository';
import { BudgetItemService } from '../service/budget-item.service';

@Module({
    imports: [TypeOrmModule.forFeature([BudgetItemRepository])],
    controllers: [BudgetItemController],
    providers: [BudgetItemService],
    exports: [BudgetItemService],
})
export class BudgetItemModule {}
