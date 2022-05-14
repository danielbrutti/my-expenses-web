import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMoneyAccount } from '../money-account.model';
import { MoneyAccountService } from '../service/money-account.service';

@Component({
  templateUrl: './money-account-delete-dialog.component.html',
})
export class MoneyAccountDeleteDialogComponent {
  moneyAccount?: IMoneyAccount;

  constructor(protected moneyAccountService: MoneyAccountService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moneyAccountService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
