import * as dayjs from 'dayjs';
import { ICategory } from 'app/entities/category/category.model';
import { IMoneyAccount } from 'app/entities/money-account/money-account.model';
import { AccountRecordType } from 'app/entities/enumerations/account-record-type.model';

export interface IAccountRecord {
  id?: number;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  type?: AccountRecordType | null;
  notes?: string | null;
  category?: ICategory | null;
  account?: IMoneyAccount | null;
}

export class AccountRecord implements IAccountRecord {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public amount?: number | null,
    public type?: AccountRecordType | null,
    public notes?: string | null,
    public category?: ICategory | null,
    public account?: IMoneyAccount | null
  ) {}
}

export function getAccountRecordIdentifier(accountRecord: IAccountRecord): number | undefined {
  return accountRecord.id;
}
