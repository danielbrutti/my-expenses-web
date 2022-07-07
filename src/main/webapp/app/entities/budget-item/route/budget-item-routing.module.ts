import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BudgetItemComponent } from '../list/budget-item.component';
import { BudgetItemDetailComponent } from '../detail/budget-item-detail.component';
import { BudgetItemUpdateComponent } from '../update/budget-item-update.component';
import { BudgetItemRoutingResolveService } from './budget-item-routing-resolve.service';

const budgetItemRoute: Routes = [
  {
    path: '',
    component: BudgetItemComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BudgetItemDetailComponent,
    resolve: {
      budgetItem: BudgetItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BudgetItemUpdateComponent,
    resolve: {
      budgetItem: BudgetItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new/:budgetId',
    component: BudgetItemUpdateComponent,
    resolve: {
      budgetItem: BudgetItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BudgetItemUpdateComponent,
    resolve: {
      budgetItem: BudgetItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(budgetItemRoute)],
  exports: [RouterModule],
})
export class BudgetItemRoutingModule {}
