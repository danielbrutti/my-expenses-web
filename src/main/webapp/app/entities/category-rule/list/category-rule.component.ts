import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategoryRule } from '../category-rule.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CategoryRuleService } from '../service/category-rule.service';
import { CategoryRuleDeleteDialogComponent } from '../delete/category-rule-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-category-rule',
  templateUrl: './category-rule.component.html',
})
export class CategoryRuleComponent implements OnInit {
  categoryRules: ICategoryRule[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected categoryRuleService: CategoryRuleService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.categoryRules = [];
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

    this.categoryRuleService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ICategoryRule[]>) => {
          this.isLoading = false;
          this.paginateCategoryRules(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.categoryRules = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICategoryRule): number {
    return item.id!;
  }

  delete(categoryRule: ICategoryRule): void {
    const modalRef = this.modalService.open(CategoryRuleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.categoryRule = categoryRule;
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

  protected paginateCategoryRules(data: ICategoryRule[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.categoryRules.push(d);
      }
    }
  }
}
