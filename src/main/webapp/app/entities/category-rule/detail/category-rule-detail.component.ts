import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategoryRule } from '../category-rule.model';

@Component({
  selector: 'jhi-category-rule-detail',
  templateUrl: './category-rule-detail.component.html',
})
export class CategoryRuleDetailComponent implements OnInit {
  categoryRule: ICategoryRule | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categoryRule }) => {
      this.categoryRule = categoryRule;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
