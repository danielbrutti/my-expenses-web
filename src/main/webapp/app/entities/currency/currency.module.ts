import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CurrencyComponent } from './list/currency.component';
import { CurrencyDetailComponent } from './detail/currency-detail.component';
import { CurrencyUpdateComponent } from './update/currency-update.component';
import { CurrencyDeleteDialogComponent } from './delete/currency-delete-dialog.component';
import { CurrencyRoutingModule } from './route/currency-routing.module';

@NgModule({
  imports: [SharedModule, CurrencyRoutingModule],
  declarations: [CurrencyComponent, CurrencyDetailComponent, CurrencyUpdateComponent, CurrencyDeleteDialogComponent],
  entryComponents: [CurrencyDeleteDialogComponent],
})
export class CurrencyModule {}
