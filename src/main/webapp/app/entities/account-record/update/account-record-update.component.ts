import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccountRecord, AccountRecord } from '../account-record.model';
import { AccountRecordService } from '../service/account-record.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IMoneyAccount } from 'app/entities/money-account/money-account.model';
import { MoneyAccountService } from 'app/entities/money-account/service/money-account.service';

import * as dayjs from 'dayjs';
import { AccountRecordType } from '../../enumerations/account-record-type.model';

@Component({
  selector: 'jhi-account-record-update',
  templateUrl: './account-record-update.component.html',
})
export class AccountRecordUpdateComponent implements OnInit {
  isSaving = false;

  categoriesSharedCollection: ICategory[] = [];
  moneyAccountsSharedCollection: IMoneyAccount[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    amount: [],
    type: [],
    notes: [],
    category: [],
    account: [],
  });

  constructor(
    protected accountRecordService: AccountRecordService,
    protected categoryService: CategoryService,
    protected moneyAccountService: MoneyAccountService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountRecord }) => {
      this.updateForm(accountRecord);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountRecord = this.createFromForm();
    if (accountRecord.id !== undefined) {
      this.subscribeToSaveResponse(this.accountRecordService.update(accountRecord));
    } else {
      this.subscribeToSaveResponse(this.accountRecordService.create(accountRecord));
    }
  }

  trackCategoryById(index: number, item: ICategory): number {
    return item.id!;
  }

  trackMoneyAccountById(index: number, item: IMoneyAccount): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountRecord>>): void {
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

  protected updateForm(accountRecord: IAccountRecord): void {
    this.editForm.patchValue({
      id: accountRecord.id,
      date: accountRecord.date ?? dayjs(),
      amount: accountRecord.amount,
      type: accountRecord.type ?? AccountRecordType.EXPENSE.toString(),
      notes: accountRecord.notes,
      category: accountRecord.category,
      account: accountRecord.account,
    });

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      accountRecord.category
    );
    this.moneyAccountsSharedCollection = this.moneyAccountService.addMoneyAccountToCollectionIfMissing(
      this.moneyAccountsSharedCollection,
      accountRecord.account
    );
  }

  protected loadRelationshipsOptions(): void {
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

    this.moneyAccountService
      .query({
        size: 100,
        sort: ['accountType, ASC'],
      })
      .pipe(map((res: HttpResponse<IMoneyAccount[]>) => res.body ?? []))
      .pipe(
        map((moneyAccounts: IMoneyAccount[]) =>
          this.moneyAccountService.addMoneyAccountToCollectionIfMissing(moneyAccounts, this.editForm.get('account')!.value)
        )
      )
      .subscribe((moneyAccounts: IMoneyAccount[]) => (this.moneyAccountsSharedCollection = moneyAccounts));
  }

  protected createFromForm(): IAccountRecord {
    return {
      ...new AccountRecord(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      type: this.editForm.get(['type'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      category: this.editForm.get(['category'])!.value,
      account: this.editForm.get(['account'])!.value,
    };
  }
}
