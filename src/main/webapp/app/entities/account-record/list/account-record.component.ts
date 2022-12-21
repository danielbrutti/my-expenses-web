import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountRecord } from '../account-record.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AccountRecordService } from '../service/account-record.service';
import { AccountRecordDeleteDialogComponent } from '../delete/account-record-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AccountRecordTransferDialogComponent } from '../transfer/account-record-transfer-dialog.component';
import { AccountRecordType } from '../../enumerations/account-record-type.model';
import { of } from 'rxjs';
import { FilterDialogComponent } from '../../../shared/filter-dialog/filter-dialog.component';
import { MoneyAccountService } from '../../money-account/service/money-account.service';
import { map } from 'rxjs/operators';
import { CategoryService } from '../../category/service/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-account-record',
  templateUrl: './account-record.component.html',
})
export class AccountRecordComponent implements OnInit {
  accountRecords: IAccountRecord[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  private _filters = [
    {
      name: 'Type',
      attribute: 'type',
      type: 'dropdown',
      options: of([
        { value: AccountRecordType.INCOME },
        { value: AccountRecordType.EXPENSE },
        { value: AccountRecordType.DEPOSIT },
        { value: AccountRecordType.WITHDRAW },
      ]),
      optionId: 'value',
      optionValue: 'value',
    },
    {
      name: 'Account',
      attribute: 'account',
      type: 'dropdown',
      options: this.moneyAccountService.queryAll({ sort: ['accountName', 'asc'] }).pipe(map(res => res.body)),
      optionId: 'id',
      optionValue: 'accountName',
    },
    {
      name: 'Category',
      attribute: 'category',
      type: 'dropdown',
      options: this.categoryService.queryAll({ sort: ['categoryName', 'asc'] }).pipe(map(res => res.body)),
      optionId: 'id',
      optionValue: 'categoryName',
    },
  ];
  private _where: any;

  constructor(
    protected accountRecordService: AccountRecordService,
    protected moneyAccountService: MoneyAccountService,
    protected categoryService: CategoryService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    private router: Router
  ) {
    this.accountRecords = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'date';
    this.ascending = false;
  }

  loadAll(): void {
    this.isLoading = true;

    this.accountRecordService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
        where: this._where ? JSON.stringify(this._where) : null,
      })
      .subscribe(
        (res: HttpResponse<IAccountRecord[]>) => {
          this.isLoading = false;
          this.paginateAccountRecords(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.accountRecords = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    const filter = localStorage.getItem(this.router.url);
    if (filter) {
      this._where = JSON.parse(filter);
    }
    this.loadAll();
  }

  trackId(index: number, item: IAccountRecord): number {
    return item.id!;
  }

  delete(accountRecord: IAccountRecord): void {
    const modalRef = this.modalService.open(AccountRecordDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountRecord = accountRecord;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  transfer(): void {
    const modalRef = this.modalService.open(AccountRecordTransferDialogComponent, { size: 'xl', backdrop: 'static' });
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'created') {
        this.reset();
      }
    });
  }

  openFilter(): void {
    const modalRef = this.modalService.open(FilterDialogComponent);
    modalRef.componentInstance.fields = this._filters;
    modalRef.result.then(result => {
      this._where = result;
      this.reset();
    });
  }

  clearFilter(): void {
    this._where = null;
    this.reset();
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateAccountRecords(data: IAccountRecord[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.accountRecords.push(d);
      }
    }
  }
}
