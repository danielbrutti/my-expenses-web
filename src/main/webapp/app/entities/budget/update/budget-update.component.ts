import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBudget, Budget } from '../budget.model';
import { BudgetService } from '../service/budget.service';

@Component({
  selector: 'jhi-budget-update',
  templateUrl: './budget-update.component.html',
})
export class BudgetUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    yearMonth: [],
    date: [null, [Validators.required]],
  });

  constructor(protected budgetService: BudgetService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ budget }) => {
      this.updateForm(budget);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const budget = this.createFromForm();
    if (budget.id !== undefined) {
      this.subscribeToSaveResponse(this.budgetService.update(budget));
    } else {
      this.subscribeToSaveResponse(this.budgetService.create(budget));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBudget>>): void {
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

  protected updateForm(budget: IBudget): void {
    this.editForm.patchValue({
      id: budget.id,
      yearMonth: budget.yearMonth,
      date: budget.date,
    });
  }

  protected createFromForm(): IBudget {
    return {
      ...new Budget(),
      id: this.editForm.get(['id'])!.value,
      yearMonth: this.editForm.get(['yearMonth'])!.value,
      date: this.editForm.get(['date'])!.value,
    };
  }
}
