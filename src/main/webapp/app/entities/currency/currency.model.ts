export interface ICurrency {
  id?: number;
  currencyName?: string | null;
  symbol?: string | null;
  usdPrice?: number | null;
}

export class Currency implements ICurrency {
  constructor(public id?: number, public currencyName?: string | null, public symbol?: string | null, public usdPrice?: number | null) {}
}

export function getCurrencyIdentifier(currency: ICurrency): number | undefined {
  return currency.id;
}
