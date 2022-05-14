import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountRecord } from '../account-record.model';
import { AccountRecordService } from '../service/account-record.service';

@Component({
  templateUrl: './account-record-delete-dialog.component.html',
})
export class AccountRecordDeleteDialogComponent {
  accountRecord?: IAccountRecord;

  constructor(protected accountRecordService: AccountRecordService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountRecordService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
