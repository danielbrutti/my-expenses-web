import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyAccountController } from '../web/rest/money-account.controller';
import { MoneyAccountRepository } from '../repository/money-account.repository';
import { MoneyAccountService } from '../service/money-account.service';

@Module({
    imports: [TypeOrmModule.forFeature([MoneyAccountRepository])],
    controllers: [MoneyAccountController],
    providers: [MoneyAccountService],
    exports: [MoneyAccountService],
})
export class MoneyAccountModule {}
