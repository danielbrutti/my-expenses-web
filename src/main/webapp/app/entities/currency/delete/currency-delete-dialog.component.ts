import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICurrency } from '../currency.model';
import { CurrencyService } from '../service/currency.service';

@Component({
  templateUrl: './currency-delete-dialog.component.html',
})
export class CurrencyDeleteDialogComponent {
  currency?: ICurrency;

  constructor(protected currencyService: CurrencyService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.currencyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
