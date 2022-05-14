import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MoneyAccountComponent } from '../list/money-account.component';
import { MoneyAccountDetailComponent } from '../detail/money-account-detail.component';
import { MoneyAccountUpdateComponent } from '../update/money-account-update.component';
import { MoneyAccountRoutingResolveService } from './money-account-routing-resolve.service';

const moneyAccountRoute: Routes = [
  {
    path: '',
    component: MoneyAccountComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MoneyAccountDetailComponent,
    resolve: {
      moneyAccount: MoneyAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MoneyAccountUpdateComponent,
    resolve: {
      moneyAccount: MoneyAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MoneyAccountUpdateComponent,
    resolve: {
      moneyAccount: MoneyAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moneyAccountRoute)],
  exports: [RouterModule],
})
export class MoneyAccountRoutingModule {}
