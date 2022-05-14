import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MoneyAccountComponent } from './list/money-account.component';
import { MoneyAccountDetailComponent } from './detail/money-account-detail.component';
import { MoneyAccountUpdateComponent } from './update/money-account-update.component';
import { MoneyAccountDeleteDialogComponent } from './delete/money-account-delete-dialog.component';
import { MoneyAccountRoutingModule } from './route/money-account-routing.module';

@NgModule({
  imports: [SharedModule, MoneyAccountRoutingModule],
  declarations: [MoneyAccountComponent, MoneyAccountDetailComponent, MoneyAccountUpdateComponent, MoneyAccountDeleteDialogComponent],
  entryComponents: [MoneyAccountDeleteDialogComponent],
})
export class MoneyAccountModule {}
