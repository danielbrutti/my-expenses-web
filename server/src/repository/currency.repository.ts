import { EntityRepository, Repository } from 'typeorm';
import { Currency } from '../domain/currency.entity';

@EntityRepository(Currency)
export class CurrencyRepository extends Repository<Currency> {}
