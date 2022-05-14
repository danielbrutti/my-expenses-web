import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from '../web/rest/currency.controller';
import { CurrencyRepository } from '../repository/currency.repository';
import { CurrencyService } from '../service/currency.service';

@Module({
    imports: [TypeOrmModule.forFeature([CurrencyRepository])],
    controllers: [CurrencyController],
    providers: [CurrencyService],
    exports: [CurrencyService],
})
export class CurrencyModule {}
