import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBudgetItem, BudgetItem } from '../budget-item.model';
import { BudgetItemService } from '../service/budget-item.service';
import { IBudget } from 'app/entities/budget/budget.model';
import { BudgetService } from 'app/entities/budget/service/budget.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

@Component({
  selector: 'jhi-budget-item-update',
  templateUrl: './budget-item-update.component.html',
})
export class BudgetItemUpdateComponent implements OnInit {
  isSaving = false;

  budgetsSharedCollection: IBudget[] = [];
  categoriesSharedCollection: ICategory[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [null, [Validators.required]],
    budget: [null, Validators.required],
    category: [null, Validators.required],
  });

  constructor(
    protected budgetItemService: BudgetItemService,
    protected budgetService: BudgetService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budgetItem }) => {
      this.updateForm(budgetItem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const budgetItem = this.createFromForm();
    if (budgetItem.id !== undefined) {
      this.subscribeToSaveResponse(this.budgetItemService.update(budgetItem));
    } else {
      this.subscribeToSaveResponse(this.budgetItemService.create(budgetItem));
    }
  }

  trackBudgetById(index: number, item: IBudget): number {
    return item.id!;
  }

  trackCategoryById(index: number, item: ICategory): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBudgetItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(budgetItem: IBudgetItem): void {
    this.editForm.patchValue({
      id: budgetItem.id,
      amount: budgetItem.amount,
      budget: budgetItem.budget,
      category: budgetItem.category,
    });

    this.budgetsSharedCollection = this.budgetService.addBudgetToCollectionIfMissing(this.budgetsSharedCollection, budgetItem.budget);
    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      budgetItem.category
    );
  }

  protected loadRelationshipsOptions(): void {
    this.budgetService
      .queryAll({
        sort: ['yearMonth', 'desc'],
      })
      .pipe(map((res: HttpResponse<IBudget[]>) => res.body ?? []))
      .pipe(map((budgets: IBudget[]) => this.budgetService.addBudgetToCollectionIfMissing(budgets, this.editForm.get('budget')!.value)))
      .subscribe((budgets: IBudget[]) => (this.budgetsSharedCollection = budgets));

    this.categoryService
      .queryAll({
        sort: ['categoryName', 'asc'],
      })
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
  }

  protected createFromForm(): IBudgetItem {
    return {
      ...new BudgetItem(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      budget: this.editForm.get(['budget'])!.value,
      category: this.editForm.get(['category'])!.value,
    };
  }
}
