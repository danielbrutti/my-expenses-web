import { IAccountRecord } from 'app/entities/account-record/account-record.model';
import { ICurrency } from 'app/entities/currency/currency.model';
import { AccountType } from 'app/entities/enumerations/account-type.model';

export interface IMoneyAccount {
  id?: number;
  accountName?: string | null;
  initialBalance?: number | null;
  accountType?: AccountType | null;
  accountRecords?: IAccountRecord[] | null;
  currency?: ICurrency | null;
}

export class MoneyAccount implements IMoneyAccount {
  constructor(
    public id?: number,
    public accountName?: string | null,
    public initialBalance?: number | null,
    public accountType?: AccountType | null,
    public accountRecords?: IAccountRecord[] | null,
    public currency?: ICurrency | null
  ) {}
}

export function getMoneyAccountIdentifier(moneyAccount: IMoneyAccount): number | undefined {
  return moneyAccount.id;
}
