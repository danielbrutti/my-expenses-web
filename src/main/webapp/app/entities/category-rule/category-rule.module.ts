import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CategoryRuleComponent } from './list/category-rule.component';
import { CategoryRuleDetailComponent } from './detail/category-rule-detail.component';
import { CategoryRuleUpdateComponent } from './update/category-rule-update.component';
import { CategoryRuleDeleteDialogComponent } from './delete/category-rule-delete-dialog.component';
import { CategoryRuleRoutingModule } from './route/category-rule-routing.module';

@NgModule({
  imports: [SharedModule, CategoryRuleRoutingModule],
  declarations: [CategoryRuleComponent, CategoryRuleDetailComponent, CategoryRuleUpdateComponent, CategoryRuleDeleteDialogComponent],
  entryComponents: [CategoryRuleDeleteDialogComponent],
})
export class CategoryRuleModule {}
