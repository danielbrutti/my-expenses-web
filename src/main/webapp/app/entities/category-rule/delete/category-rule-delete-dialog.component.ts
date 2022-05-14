import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategoryRule } from '../category-rule.model';
import { CategoryRuleService } from '../service/category-rule.service';

@Component({
  templateUrl: './category-rule-delete-dialog.component.html',
})
export class CategoryRuleDeleteDialogComponent {
  categoryRule?: ICategoryRule;

  constructor(protected categoryRuleService: CategoryRuleService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.categoryRuleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
