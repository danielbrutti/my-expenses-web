import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMoneyAccount, MoneyAccount } from '../money-account.model';
import { MoneyAccountService } from '../service/money-account.service';
import { ICurrency } from 'app/entities/currency/currency.model';
import { CurrencyService } from 'app/entities/currency/service/currency.service';

@Component({
  selector: 'jhi-money-account-update',
  templateUrl: './money-account-update.component.html',
})
export class MoneyAccountUpdateComponent implements OnInit {
  isSaving = false;

  currenciesSharedCollection: ICurrency[] = [];

  editForm = this.fb.group({
    id: [],
    accountName: [],
    initialBalance: [],
    accountType: [],
    currency: [],
  });

  constructor(
    protected moneyAccountService: MoneyAccountService,
    protected currencyService: CurrencyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moneyAccount }) => {
      this.updateForm(moneyAccount);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const moneyAccount = this.createFromForm();
    if (moneyAccount.id !== undefined) {
      this.subscribeToSaveResponse(this.moneyAccountService.update(moneyAccount));
    } else {
      this.subscribeToSaveResponse(this.moneyAccountService.create(moneyAccount));
    }
  }

  trackCurrencyById(index: number, item: ICurrency): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoneyAccount>>): void {
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

  protected updateForm(moneyAccount: IMoneyAccount): void {
    this.editForm.patchValue({
      id: moneyAccount.id,
      accountName: moneyAccount.accountName,
      initialBalance: moneyAccount.initialBalance,
      accountType: moneyAccount.accountType,
      currency: moneyAccount.currency,
    });

    this.currenciesSharedCollection = this.currencyService.addCurrencyToCollectionIfMissing(
      this.currenciesSharedCollection,
      moneyAccount.currency
    );
  }

  protected loadRelationshipsOptions(): void {
    this.currencyService
      .queryAll({
        sort: ['currencyName', 'asc'],
      })
      .pipe(map((res: HttpResponse<ICurrency[]>) => res.body ?? []))
      .pipe(
        map((currencies: ICurrency[]) =>
          this.currencyService.addCurrencyToCollectionIfMissing(currencies, this.editForm.get('currency')!.value)
        )
      )
      .subscribe((currencies: ICurrency[]) => (this.currenciesSharedCollection = currencies));
  }

  protected createFromForm(): IMoneyAccount {
    return {
      ...new MoneyAccount(),
      id: this.editForm.get(['id'])!.value,
      accountName: this.editForm.get(['accountName'])!.value,
      initialBalance: this.editForm.get(['initialBalance'])!.value,
      accountType: this.editForm.get(['accountType'])!.value,
      currency: this.editForm.get(['currency'])!.value,
    };
  }
}
