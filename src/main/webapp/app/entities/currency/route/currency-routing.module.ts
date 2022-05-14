import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CurrencyComponent } from '../list/currency.component';
import { CurrencyDetailComponent } from '../detail/currency-detail.component';
import { CurrencyUpdateComponent } from '../update/currency-update.component';
import { CurrencyRoutingResolveService } from './currency-routing-resolve.service';

const currencyRoute: Routes = [
  {
    path: '',
    component: CurrencyComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CurrencyDetailComponent,
    resolve: {
      currency: CurrencyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CurrencyUpdateComponent,
    resolve: {
      currency: CurrencyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CurrencyUpdateComponent,
    resolve: {
      currency: CurrencyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(currencyRoute)],
  exports: [RouterModule],
})
export class CurrencyRoutingModule {}
