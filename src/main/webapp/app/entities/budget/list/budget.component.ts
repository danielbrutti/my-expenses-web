import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBudget } from '../budget.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { BudgetService } from '../service/budget.service';
import { BudgetDeleteDialogComponent } from '../delete/budget-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { BudgetCopyDialogComponent } from '../copy/budget-copy-dialog.component';
@Component({
  selector: 'jhi-budget',
  templateUrl: './budget.component.html',
})
export class BudgetComponent implements OnInit {
  budgets: IBudget[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected budgetService: BudgetService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.budgets = [];
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

    this.budgetService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IBudget[]>) => {
          this.isLoading = false;
          this.paginateBudgets(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.budgets = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBudget): number {
    return item.id!;
  }

  copy(budget: IBudget): void {
    const modalRef = this.modalService.open(BudgetCopyDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.budget = budget;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'copied') {
        this.reset();
      }
    });
  }

  delete(budget: IBudget): void {
    const modalRef = this.modalService.open(BudgetDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.budget = budget;
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

  protected paginateBudgets(data: IBudget[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.budgets.push(d);
      }
    }
  }
}
