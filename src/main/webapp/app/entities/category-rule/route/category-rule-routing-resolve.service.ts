import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICategoryRule, CategoryRule } from '../category-rule.model';
import { CategoryRuleService } from '../service/category-rule.service';

@Injectable({ providedIn: 'root' })
export class CategoryRuleRoutingResolveService implements Resolve<ICategoryRule> {
  constructor(protected service: CategoryRuleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategoryRule> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((categoryRule: HttpResponse<CategoryRule>) => {
          if (categoryRule.body) {
            return of(categoryRule.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CategoryRule());
  }
}
