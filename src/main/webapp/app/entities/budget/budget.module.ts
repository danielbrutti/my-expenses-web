import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BudgetComponent } from './list/budget.component';
import { BudgetDetailComponent } from './detail/budget-detail.component';
import { BudgetUpdateComponent } from './update/budget-update.component';
import { BudgetDeleteDialogComponent } from './delete/budget-delete-dialog.component';
import { BudgetRoutingModule } from './route/budget-routing.module';
import { BudgetItemModule } from '../budget-item/budget-item.module';

@NgModule({
  imports: [SharedModule, BudgetRoutingModule, BudgetItemModule],
  declarations: [BudgetComponent, BudgetDetailComponent, BudgetUpdateComponent, BudgetDeleteDialogComponent],
  entryComponents: [BudgetDeleteDialogComponent],
})
export class BudgetModule {}
