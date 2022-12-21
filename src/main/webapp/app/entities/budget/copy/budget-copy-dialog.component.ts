import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBudget } from '../budget.model';
import { BudgetService } from '../service/budget.service';

@Component({
  templateUrl: './budget-copy-dialog.component.html',
})
export class BudgetCopyDialogComponent {
  budget?: IBudget;

  constructor(protected budgetService: BudgetService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmCopy(): void {
    this.budgetService.copy(this.budget!).subscribe(() => {
      this.activeModal.close('copied');
    });
  }
}
