import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMoneyAccount, getMoneyAccountIdentifier } from '../money-account.model';

export type EntityResponseType = HttpResponse<IMoneyAccount>;
export type EntityArrayResponseType = HttpResponse<IMoneyAccount[]>;

@Injectable({ providedIn: 'root' })
export class MoneyAccountService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/money-accounts');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(moneyAccount: IMoneyAccount): Observable<EntityResponseType> {
    return this.http.post<IMoneyAccount>(this.resourceUrl, moneyAccount, { observe: 'response' });
  }

  update(moneyAccount: IMoneyAccount): Observable<EntityResponseType> {
    return this.http.put<IMoneyAccount>(`${this.resourceUrl}/${getMoneyAccountIdentifier(moneyAccount) as number}`, moneyAccount, {
      observe: 'response',
    });
  }

  partialUpdate(moneyAccount: IMoneyAccount): Observable<EntityResponseType> {
    return this.http.patch<IMoneyAccount>(`${this.resourceUrl}/${getMoneyAccountIdentifier(moneyAccount) as number}`, moneyAccount, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMoneyAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  queryAll(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMoneyAccount[]>(`${this.resourceUrl}/all`, { params: options, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMoneyAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMoneyAccountToCollectionIfMissing(
    moneyAccountCollection: IMoneyAccount[],
    ...moneyAccountsToCheck: (IMoneyAccount | null | undefined)[]
  ): IMoneyAccount[] {
    const moneyAccounts: IMoneyAccount[] = moneyAccountsToCheck.filter(isPresent);
    if (moneyAccounts.length > 0) {
      const moneyAccountCollectionIdentifiers = moneyAccountCollection.map(
        moneyAccountItem => getMoneyAccountIdentifier(moneyAccountItem)!
      );
      const moneyAccountsToAdd = moneyAccounts.filter(moneyAccountItem => {
        const moneyAccountIdentifier = getMoneyAccountIdentifier(moneyAccountItem);
        if (moneyAccountIdentifier == null || moneyAccountCollectionIdentifiers.includes(moneyAccountIdentifier)) {
          return false;
        }
        moneyAccountCollectionIdentifiers.push(moneyAccountIdentifier);
        return true;
      });
      return [...moneyAccountsToAdd, ...moneyAccountCollection];
    }
    return moneyAccountCollection;
  }
}
