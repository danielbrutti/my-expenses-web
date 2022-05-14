import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMoneyAccount } from '../money-account.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { MoneyAccountService } from '../service/money-account.service';
import { MoneyAccountDeleteDialogComponent } from '../delete/money-account-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-money-account',
  templateUrl: './money-account.component.html',
})
export class MoneyAccountComponent implements OnInit {
  moneyAccounts: IMoneyAccount[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected moneyAccountService: MoneyAccountService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.moneyAccounts = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.moneyAccountService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IMoneyAccount[]>) => {
          this.isLoading = false;
          this.paginateMoneyAccounts(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.moneyAccounts = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMoneyAccount): number {
    return item.id!;
  }

  delete(moneyAccount: IMoneyAccount): void {
    const modalRef = this.modalService.open(MoneyAccountDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.moneyAccount = moneyAccount;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateMoneyAccounts(data: IMoneyAccount[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.moneyAccounts.push(d);
      }
    }
  }
}
