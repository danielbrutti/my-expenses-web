import { EntityRepository, Repository } from 'typeorm';
import { MoneyAccount } from '../domain/money-account.entity';

@EntityRepository(MoneyAccount)
export class MoneyAccountRepository extends Repository<MoneyAccount> {}
