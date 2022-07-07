import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BudgetComponent } from '../list/budget.component';
import { BudgetDetailComponent } from '../detail/budget-detail.component';
import { BudgetUpdateComponent } from '../update/budget-update.component';
import { BudgetRoutingResolveService } from './budget-routing-resolve.service';

const budgetRoute: Routes = [
  {
    path: '',
    component: BudgetComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BudgetDetailComponent,
    resolve: {
      budget: BudgetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BudgetUpdateComponent,
    resolve: {
      budget: BudgetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BudgetUpdateComponent,
    resolve: {
      budget: BudgetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(budgetRoute)],
  exports: [RouterModule],
})
export class BudgetRoutingModule {}
