import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountRecord } from '../account-record.model';

@Component({
  selector: 'jhi-account-record-detail',
  templateUrl: './account-record-detail.component.html',
})
export class AccountRecordDetailComponent implements OnInit {
  accountRecord: IAccountRecord | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountRecord }) => {
      this.accountRecord = accountRecord;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
