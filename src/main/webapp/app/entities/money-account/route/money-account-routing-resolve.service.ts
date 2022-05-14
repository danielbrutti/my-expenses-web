import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMoneyAccount, MoneyAccount } from '../money-account.model';
import { MoneyAccountService } from '../service/money-account.service';

@Injectable({ providedIn: 'root' })
export class MoneyAccountRoutingResolveService implements Resolve<IMoneyAccount> {
  constructor(protected service: MoneyAccountService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMoneyAccount> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((moneyAccount: HttpResponse<MoneyAccount>) => {
          if (moneyAccount.body) {
            return of(moneyAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MoneyAccount());
  }
}
