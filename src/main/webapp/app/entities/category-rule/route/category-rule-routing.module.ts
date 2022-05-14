import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CategoryRuleComponent } from '../list/category-rule.component';
import { CategoryRuleDetailComponent } from '../detail/category-rule-detail.component';
import { CategoryRuleUpdateComponent } from '../update/category-rule-update.component';
import { CategoryRuleRoutingResolveService } from './category-rule-routing-resolve.service';

const categoryRuleRoute: Routes = [
  {
    path: '',
    component: CategoryRuleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CategoryRuleDetailComponent,
    resolve: {
      categoryRule: CategoryRuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CategoryRuleUpdateComponent,
    resolve: {
      categoryRule: CategoryRuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CategoryRuleUpdateComponent,
    resolve: {
      categoryRule: CategoryRuleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(categoryRuleRoute)],
  exports: [RouterModule],
})
export class CategoryRuleRoutingModule {}
