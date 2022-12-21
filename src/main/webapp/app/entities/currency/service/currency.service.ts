import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICurrency, getCurrencyIdentifier } from '../currency.model';

export type EntityResponseType = HttpResponse<ICurrency>;
export type EntityArrayResponseType = HttpResponse<ICurrency[]>;

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/currencies');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(currency: ICurrency): Observable<EntityResponseType> {
    return this.http.post<ICurrency>(this.resourceUrl, currency, { observe: 'response' });
  }

  update(currency: ICurrency): Observable<EntityResponseType> {
    return this.http.put<ICurrency>(`${this.resourceUrl}/${getCurrencyIdentifier(currency) as number}`, currency, { observe: 'response' });
  }

  partialUpdate(currency: ICurrency): Observable<EntityResponseType> {
    return this.http.patch<ICurrency>(`${this.resourceUrl}/${getCurrencyIdentifier(currency) as number}`, currency, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICurrency>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  queryAll(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICurrency[]>(`${this.resourceUrl}/all`, { params: options, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICurrency[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCurrencyToCollectionIfMissing(currencyCollection: ICurrency[], ...currenciesToCheck: (ICurrency | null | undefined)[]): ICurrency[] {
    const currencies: ICurrency[] = currenciesToCheck.filter(isPresent);
    if (currencies.length > 0) {
      const currencyCollectionIdentifiers = currencyCollection.map(currencyItem => getCurrencyIdentifier(currencyItem)!);
      const currenciesToAdd = currencies.filter(currencyItem => {
        const currencyIdentifier = getCurrencyIdentifier(currencyItem);
        if (currencyIdentifier == null || currencyCollectionIdentifiers.includes(currencyIdentifier)) {
          return false;
        }
        currencyCollectionIdentifiers.push(currencyIdentifier);
        return true;
      });
      return [...currenciesToAdd, ...currencyCollection];
    }
    return currencyCollection;
  }
}
