import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountRecordComponent } from '../list/account-record.component';
import { AccountRecordDetailComponent } from '../detail/account-record-detail.component';
import { AccountRecordUpdateComponent } from '../update/account-record-update.component';
import { AccountRecordRoutingResolveService } from './account-record-routing-resolve.service';

const accountRecordRoute: Routes = [
  {
    path: '',
    component: AccountRecordComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountRecordDetailComponent,
    resolve: {
      accountRecord: AccountRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountRecordUpdateComponent,
    resolve: {
      accountRecord: AccountRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountRecordUpdateComponent,
    resolve: {
      accountRecord: AccountRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountRecordRoute)],
  exports: [RouterModule],
})
export class AccountRecordRoutingModule {}
