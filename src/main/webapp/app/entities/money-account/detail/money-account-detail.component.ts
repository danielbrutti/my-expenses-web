import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMoneyAccount } from '../money-account.model';

@Component({
  selector: 'jhi-money-account-detail',
  templateUrl: './money-account-detail.component.html',
})
export class MoneyAccountDetailComponent implements OnInit {
  moneyAccount: IMoneyAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moneyAccount }) => {
      this.moneyAccount = moneyAccount;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
