import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBudget, getBudgetIdentifier } from '../budget.model';

export type EntityResponseType = HttpResponse<IBudget>;
export type EntityArrayResponseType = HttpResponse<IBudget[]>;

@Injectable({ providedIn: 'root' })
export class BudgetService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/budgets');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(budget: IBudget): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(budget);
    return this.http
      .post<IBudget>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(budget: IBudget): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(budget);
    return this.http
      .put<IBudget>(`${this.resourceUrl}/${getBudgetIdentifier(budget) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(budget: IBudget): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(budget);
    return this.http
      .patch<IBudget>(`${this.resourceUrl}/${getBudgetIdentifier(budget) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBudget>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBudget[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBudgetToCollectionIfMissing(budgetCollection: IBudget[], ...budgetsToCheck: (IBudget | null | undefined)[]): IBudget[] {
    const budgets: IBudget[] = budgetsToCheck.filter(isPresent);
    if (budgets.length > 0) {
      const budgetCollectionIdentifiers = budgetCollection.map(budgetItem => getBudgetIdentifier(budgetItem)!);
      const budgetsToAdd = budgets.filter(budgetItem => {
        const budgetIdentifier = getBudgetIdentifier(budgetItem);
        if (budgetIdentifier == null || budgetCollectionIdentifiers.includes(budgetIdentifier)) {
          return false;
        }
        budgetCollectionIdentifiers.push(budgetIdentifier);
        return true;
      });
      return [...budgetsToAdd, ...budgetCollection];
    }
    return budgetCollection;
  }

  protected convertDateFromClient(budget: IBudget): IBudget {
    return Object.assign({}, budget, {
      date: budget.date?.isValid() ? budget.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((budget: IBudget) => {
        budget.date = budget.date ? dayjs(budget.date) : undefined;
      });
    }
    return res;
  }
}
