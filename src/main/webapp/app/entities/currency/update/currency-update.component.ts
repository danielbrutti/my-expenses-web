import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICurrency, Currency } from '../currency.model';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'jhi-currency-update',
  templateUrl: './currency-update.component.html',
})
export class CurrencyUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    currencyName: [],
    symbol: [],
    usdPrice: [],
  });

  constructor(protected currencyService: CurrencyService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ currency }) => {
      this.updateForm(currency);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const currency = this.createFromForm();
    if (currency.id !== undefined) {
      this.subscribeToSaveResponse(this.currencyService.update(currency));
    } else {
      this.subscribeToSaveResponse(this.currencyService.create(currency));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurrency>>): void {
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

  protected updateForm(currency: ICurrency): void {
    this.editForm.patchValue({
      id: currency.id,
      currencyName: currency.currencyName,
      symbol: currency.symbol,
      usdPrice: currency.usdPrice,
    });
  }

  protected createFromForm(): ICurrency {
    return {
      ...new Currency(),
      id: this.editForm.get(['id'])!.value,
      currencyName: this.editForm.get(['currencyName'])!.value,
      symbol: this.editForm.get(['symbol'])!.value,
      usdPrice: this.editForm.get(['usdPrice'])!.value,
    };
  }
}
