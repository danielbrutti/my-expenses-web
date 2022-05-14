import { EntityRepository, Repository } from 'typeorm';
import { AccountRecord } from '../domain/account-record.entity';

@EntityRepository(AccountRecord)
export class AccountRecordRepository extends Repository<AccountRecord> {}
