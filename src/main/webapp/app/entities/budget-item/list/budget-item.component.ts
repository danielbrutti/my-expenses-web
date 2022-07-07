import { Component, Input, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBudgetItem } from '../budget-item.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { BudgetItemService } from '../service/budget-item.service';
import { BudgetItemDeleteDialogComponent } from '../delete/budget-item-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-budget-item',
  templateUrl: './budget-item.component.html',
})
export class BudgetItemComponent implements OnInit {
  @Input()
  budgetId?: number;

  budgetItems: IBudgetItem[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected budgetItemService: BudgetItemService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.budgetItems = [];
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

    this.budgetItemService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
        where: this.budgetId ? JSON.stringify({ budget: this.budgetId }) : null,
      })
      .subscribe(
        (res: HttpResponse<IBudgetItem[]>) => {
          this.isLoading = false;
          this.paginateBudgetItems(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.budgetItems = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBudgetItem): number {
    return item.id!;
  }

  delete(budgetItem: IBudgetItem): void {
    const modalRef = this.modalService.open(BudgetItemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.budgetItem = budgetItem;
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

  protected paginateBudgetItems(data: IBudgetItem[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.budgetItems.push(d);
      }
    }
  }
}
