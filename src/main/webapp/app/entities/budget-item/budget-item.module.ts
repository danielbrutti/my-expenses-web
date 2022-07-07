import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BudgetItemComponent } from './list/budget-item.component';
import { BudgetItemDetailComponent } from './detail/budget-item-detail.component';
import { BudgetItemUpdateComponent } from './update/budget-item-update.component';
import { BudgetItemDeleteDialogComponent } from './delete/budget-item-delete-dialog.component';
import { BudgetItemRoutingModule } from './route/budget-item-routing.module';

@NgModule({
  imports: [SharedModule, BudgetItemRoutingModule],
  declarations: [BudgetItemComponent, BudgetItemDetailComponent, BudgetItemUpdateComponent, BudgetItemDeleteDialogComponent],
  entryComponents: [BudgetItemDeleteDialogComponent],
  exports: [BudgetItemComponent],
})
export class BudgetItemModule {}
