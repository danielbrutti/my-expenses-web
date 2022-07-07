import * as dayjs from 'dayjs';

export interface IBudget {
  id?: number;
  yearMonth?: string | null;
  date?: dayjs.Dayjs;
}

export class Budget implements IBudget {
  constructor(public id?: number, public yearMonth?: string | null, public date?: dayjs.Dayjs) {}
}

export function getBudgetIdentifier(budget: IBudget): number | undefined {
  return budget.id;
}
