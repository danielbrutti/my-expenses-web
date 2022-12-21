import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AccountRecordType } from '../../enumerations/account-record-type.model';
import { IMoneyAccount } from '../../money-account/money-account.model';
import { MoneyAccountService } from '../../money-account/service/money-account.service';
import { AccountRecord, IAccountRecord } from '../account-record.model';
import { AccountRecordService } from '../service/account-record.service';

import * as dayjs from 'dayjs';

@Component({
  templateUrl: './account-record-transfer-dialog.component.html',
})
export class AccountRecordTransferDialogComponent implements OnInit {
  isSaving = false;

  moneyAccountsSharedCollection: IMoneyAccount[] = [];

  editForm = this.fb.group({
    date: [dayjs()],
    amount: [],
    accountFrom: [null, [this.validateSameCurrency(), this.validateSameAccount()]],
    accountTo: [null, [this.validateSameCurrency(), this.validateSameAccount()]],
  });

  constructor(
    protected accountRecordService: AccountRecordService,
    protected moneyAccountService: MoneyAccountService,
    protected fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadRelationshipsOptions();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  save(): void {
    this.isSaving = true;
    const accountRecords: IAccountRecord[] = this.createFromForm();
    combineLatest([this.accountRecordService.create(accountRecords[0]), this.accountRecordService.create(accountRecords[1])])
      .pipe(finalize(() => this.onSaveFinalize()))
      .subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
  }

  trackMoneyAccountById(index: number, item: IMoneyAccount): number {
    return item.id!;
  }

  protected createFromForm(): IAccountRecord[] {
    return [
      {
        ...new AccountRecord(),
        date: this.editForm.get(['date'])!.value,
        amount: this.editForm.get(['amount'])!.value,
        type: AccountRecordType.WITHDRAW,
        account: this.editForm.get(['accountFrom'])!.value,
      },
      {
        ...new AccountRecord(),
        date: this.editForm.get(['date'])!.value,
        amount: this.editForm.get(['amount'])!.value,
        type: AccountRecordType.DEPOSIT,
        account: this.editForm.get(['accountTo'])!.value,
      },
    ];
  }

  protected onSaveSuccess(): void {
    this.activeModal.close('created');
  }

  protected onSaveError(): void {
    this.cancel();
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected loadRelationshipsOptions(): void {
    this.moneyAccountService
      .queryAll({
        sort: ['accountType, asc'],
      })
      .pipe(map((res: HttpResponse<IMoneyAccount[]>) => res.body ?? []))
      .pipe(
        map((moneyAccounts: IMoneyAccount[]) =>
          this.moneyAccountService.addMoneyAccountToCollectionIfMissing(moneyAccounts, this.editForm.get('accountTo')!.value)
        )
      )
      .pipe(
        map((moneyAccounts: IMoneyAccount[]) =>
          this.moneyAccountService.addMoneyAccountToCollectionIfMissing(moneyAccounts, this.editForm.get('accountFrom')!.value)
        )
      )
      .subscribe((moneyAccounts: IMoneyAccount[]) => (this.moneyAccountsSharedCollection = moneyAccounts));
  }

  private validateSameCurrency(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) {
        return null;
      }
      const accountFrom: IMoneyAccount | null = formGroup.get('accountFrom')?.value;
      const accountTo: IMoneyAccount | null = formGroup.get('accountTo')?.value;
      if (accountTo && accountFrom && accountTo.currency?.id !== accountFrom.currency?.id) {
        return { invalidCurrency: true };
      }

      formGroup.updateValueAndValidity();
      return null;
    };
  }

  private validateSameAccount(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) {
        return null;
      }
      const accountFrom: IMoneyAccount | null = formGroup.get('accountFrom')?.value;
      const accountTo: IMoneyAccount | null = formGroup.get('accountTo')?.value;
      if (accountTo && accountFrom && accountTo.id === accountFrom.id) {
        return { invalidSameAccount: true };
      }

      formGroup.updateValueAndValidity();
      return null;
    };
  }
}
