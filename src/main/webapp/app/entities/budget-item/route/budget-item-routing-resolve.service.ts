import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { IBudgetItem, BudgetItem } from '../budget-item.model';
import { BudgetItemService } from '../service/budget-item.service';
import { BudgetService } from '../../budget/service/budget.service';
import { Budget } from '../../budget/budget.model';

@Injectable({ providedIn: 'root' })
export class BudgetItemRoutingResolveService implements Resolve<IBudgetItem> {
  constructor(protected service: BudgetItemService, protected budgetService: BudgetService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBudgetItem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((budgetItem: HttpResponse<BudgetItem>) => {
          if (budgetItem.body) {
            return of(budgetItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    const budgetId = route.params['budgetId'];
    if (!budgetId) {
      return of(new BudgetItem());
    }

    return this.budgetService.find(budgetId).pipe(
      switchMap((budget: HttpResponse<Budget>) => {
        const budgetItem = new BudgetItem();
        budgetItem.budget = budget.body!;
        return of(budgetItem);
      })
    );
  }
}
