import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBudget, Budget } from '../budget.model';
import { BudgetService } from '../service/budget.service';

@Injectable({ providedIn: 'root' })
export class BudgetRoutingResolveService implements Resolve<IBudget> {
  constructor(protected service: BudgetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBudget> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((budget: HttpResponse<Budget>) => {
          if (budget.body) {
            return of(budget.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Budget());
  }
}
