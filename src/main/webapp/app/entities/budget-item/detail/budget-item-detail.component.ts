import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBudgetItem } from '../budget-item.model';

@Component({
  selector: 'jhi-budget-item-detail',
  templateUrl: './budget-item-detail.component.html',
})
export class BudgetItemDetailComponent implements OnInit {
  budgetItem: IBudgetItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budgetItem }) => {
      this.budgetItem = budgetItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
