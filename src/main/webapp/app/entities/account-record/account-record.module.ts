import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AccountRecordComponent } from './list/account-record.component';
import { AccountRecordDetailComponent } from './detail/account-record-detail.component';
import { AccountRecordUpdateComponent } from './update/account-record-update.component';
import { AccountRecordDeleteDialogComponent } from './delete/account-record-delete-dialog.component';
import { AccountRecordRoutingModule } from './route/account-record-routing.module';
import { AccountRecordTransferDialogComponent } from './transfer/account-record-transfer-dialog.component';

@NgModule({
  imports: [SharedModule, AccountRecordRoutingModule],
  declarations: [
    AccountRecordComponent,
    AccountRecordDetailComponent,
    AccountRecordUpdateComponent,
    AccountRecordDeleteDialogComponent,
    AccountRecordTransferDialogComponent,
  ],
  entryComponents: [AccountRecordDeleteDialogComponent, AccountRecordTransferDialogComponent],
})
export class AccountRecordModule {}
