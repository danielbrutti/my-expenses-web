import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBudget } from '../budget.model';
import { BudgetService } from '../service/budget.service';

@Component({
  templateUrl: './budget-delete-dialog.component.html',
})
export class BudgetDeleteDialogComponent {
  budget?: IBudget;

  constructor(protected budgetService: BudgetService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.budgetService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
