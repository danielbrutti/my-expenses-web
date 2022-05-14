import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRecordController } from '../web/rest/account-record.controller';
import { AccountRecordRepository } from '../repository/account-record.repository';
import { AccountRecordService } from '../service/account-record.service';

@Module({
    imports: [TypeOrmModule.forFeature([AccountRecordRepository])],
    controllers: [AccountRecordController],
    providers: [AccountRecordService],
    exports: [AccountRecordService],
})
export class AccountRecordModule {}
