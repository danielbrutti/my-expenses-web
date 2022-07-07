import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBudgetItem, getBudgetItemIdentifier } from '../budget-item.model';

export type EntityResponseType = HttpResponse<IBudgetItem>;
export type EntityArrayResponseType = HttpResponse<IBudgetItem[]>;

@Injectable({ providedIn: 'root' })
export class BudgetItemService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/budget-items');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(budgetItem: IBudgetItem): Observable<EntityResponseType> {
    return this.http.post<IBudgetItem>(this.resourceUrl, budgetItem, { observe: 'response' });
  }

  update(budgetItem: IBudgetItem): Observable<EntityResponseType> {
    return this.http.put<IBudgetItem>(`${this.resourceUrl}/${getBudgetItemIdentifier(budgetItem) as number}`, budgetItem, {
      observe: 'response',
    });
  }

  partialUpdate(budgetItem: IBudgetItem): Observable<EntityResponseType> {
    return this.http.patch<IBudgetItem>(`${this.resourceUrl}/${getBudgetItemIdentifier(budgetItem) as number}`, budgetItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBudgetItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBudgetItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBudgetItemToCollectionIfMissing(
    budgetItemCollection: IBudgetItem[],
    ...budgetItemsToCheck: (IBudgetItem | null | undefined)[]
  ): IBudgetItem[] {
    const budgetItems: IBudgetItem[] = budgetItemsToCheck.filter(isPresent);
    if (budgetItems.length > 0) {
      const budgetItemCollectionIdentifiers = budgetItemCollection.map(budgetItemItem => getBudgetItemIdentifier(budgetItemItem)!);
      const budgetItemsToAdd = budgetItems.filter(budgetItemItem => {
        const budgetItemIdentifier = getBudgetItemIdentifier(budgetItemItem);
        if (budgetItemIdentifier == null || budgetItemCollectionIdentifiers.includes(budgetItemIdentifier)) {
          return false;
        }
        budgetItemCollectionIdentifiers.push(budgetItemIdentifier);
        return true;
      });
      return [...budgetItemsToAdd, ...budgetItemCollection];
    }
    return budgetItemCollection;
  }
}
