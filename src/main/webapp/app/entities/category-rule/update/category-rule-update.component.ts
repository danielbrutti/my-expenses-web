import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICategoryRule, CategoryRule } from '../category-rule.model';
import { CategoryRuleService } from '../service/category-rule.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

@Component({
  selector: 'jhi-category-rule-update',
  templateUrl: './category-rule-update.component.html',
})
export class CategoryRuleUpdateComponent implements OnInit {
  isSaving = false;

  categoriesCollection: ICategory[] = [];

  editForm = this.fb.group({
    id: [],
    match: [],
    category: [],
  });

  constructor(
    protected categoryRuleService: CategoryRuleService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categoryRule }) => {
      this.updateForm(categoryRule);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const categoryRule = this.createFromForm();
    if (categoryRule.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryRuleService.update(categoryRule));
    } else {
      this.subscribeToSaveResponse(this.categoryRuleService.create(categoryRule));
    }
  }

  trackCategoryById(index: number, item: ICategory): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategoryRule>>): void {
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

  protected updateForm(categoryRule: ICategoryRule): void {
    this.editForm.patchValue({
      id: categoryRule.id,
      match: categoryRule.match,
      category: categoryRule.category,
    });

    this.categoriesCollection = this.categoryService.addCategoryToCollectionIfMissing(this.categoriesCollection, categoryRule.category);
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query({ 'categoryRuleId.specified': 'false' })
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesCollection = categories));
  }

  protected createFromForm(): ICategoryRule {
    return {
      ...new CategoryRule(),
      id: this.editForm.get(['id'])!.value,
      match: this.editForm.get(['match'])!.value,
      category: this.editForm.get(['category'])!.value,
    };
  }
}
