import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountRecord, AccountRecord } from '../account-record.model';
import { AccountRecordService } from '../service/account-record.service';

@Injectable({ providedIn: 'root' })
export class AccountRecordRoutingResolveService implements Resolve<IAccountRecord> {
  constructor(protected service: AccountRecordService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountRecord> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountRecord: HttpResponse<AccountRecord>) => {
          if (accountRecord.body) {
            return of(accountRecord.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AccountRecord());
  }
}
