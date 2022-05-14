import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICurrency } from '../currency.model';

@Component({
  selector: 'jhi-currency-detail',
  templateUrl: './currency-detail.component.html',
})
export class CurrencyDetailComponent implements OnInit {
  currency: ICurrency | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ currency }) => {
      this.currency = currency;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
