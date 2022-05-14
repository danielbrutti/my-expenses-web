import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategoryRule, getCategoryRuleIdentifier } from '../category-rule.model';

export type EntityResponseType = HttpResponse<ICategoryRule>;
export type EntityArrayResponseType = HttpResponse<ICategoryRule[]>;

@Injectable({ providedIn: 'root' })
export class CategoryRuleService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/category-rules');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(categoryRule: ICategoryRule): Observable<EntityResponseType> {
    return this.http.post<ICategoryRule>(this.resourceUrl, categoryRule, { observe: 'response' });
  }

  update(categoryRule: ICategoryRule): Observable<EntityResponseType> {
    return this.http.put<ICategoryRule>(`${this.resourceUrl}/${getCategoryRuleIdentifier(categoryRule) as number}`, categoryRule, {
      observe: 'response',
    });
  }

  partialUpdate(categoryRule: ICategoryRule): Observable<EntityResponseType> {
    return this.http.patch<ICategoryRule>(`${this.resourceUrl}/${getCategoryRuleIdentifier(categoryRule) as number}`, categoryRule, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategoryRule>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategoryRule[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCategoryRuleToCollectionIfMissing(
    categoryRuleCollection: ICategoryRule[],
    ...categoryRulesToCheck: (ICategoryRule | null | undefined)[]
  ): ICategoryRule[] {
    const categoryRules: ICategoryRule[] = categoryRulesToCheck.filter(isPresent);
    if (categoryRules.length > 0) {
      const categoryRuleCollectionIdentifiers = categoryRuleCollection.map(
        categoryRuleItem => getCategoryRuleIdentifier(categoryRuleItem)!
      );
      const categoryRulesToAdd = categoryRules.filter(categoryRuleItem => {
        const categoryRuleIdentifier = getCategoryRuleIdentifier(categoryRuleItem);
        if (categoryRuleIdentifier == null || categoryRuleCollectionIdentifiers.includes(categoryRuleIdentifier)) {
          return false;
        }
        categoryRuleCollectionIdentifiers.push(categoryRuleIdentifier);
        return true;
      });
      return [...categoryRulesToAdd, ...categoryRuleCollection];
    }
    return categoryRuleCollection;
  }
}
