import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountRecord, getAccountRecordIdentifier } from '../account-record.model';

export type EntityResponseType = HttpResponse<IAccountRecord>;
export type EntityArrayResponseType = HttpResponse<IAccountRecord[]>;

@Injectable({ providedIn: 'root' })
export class AccountRecordService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/account-records');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(accountRecord: IAccountRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountRecord);
    return this.http
      .post<IAccountRecord>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(accountRecord: IAccountRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountRecord);
    return this.http
      .put<IAccountRecord>(`${this.resourceUrl}/${getAccountRecordIdentifier(accountRecord) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(accountRecord: IAccountRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountRecord);
    return this.http
      .patch<IAccountRecord>(`${this.resourceUrl}/${getAccountRecordIdentifier(accountRecord) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAccountRecord>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAccountRecord[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountRecordToCollectionIfMissing(
    accountRecordCollection: IAccountRecord[],
    ...accountRecordsToCheck: (IAccountRecord | null | undefined)[]
  ): IAccountRecord[] {
    const accountRecords: IAccountRecord[] = accountRecordsToCheck.filter(isPresent);
    if (accountRecords.length > 0) {
      const accountRecordCollectionIdentifiers = accountRecordCollection.map(
        accountRecordItem => getAccountRecordIdentifier(accountRecordItem)!
      );
      const accountRecordsToAdd = accountRecords.filter(accountRecordItem => {
        const accountRecordIdentifier = getAccountRecordIdentifier(accountRecordItem);
        if (accountRecordIdentifier == null || accountRecordCollectionIdentifiers.includes(accountRecordIdentifier)) {
          return false;
        }
        accountRecordCollectionIdentifiers.push(accountRecordIdentifier);
        return true;
      });
      return [...accountRecordsToAdd, ...accountRecordCollection];
    }
    return accountRecordCollection;
  }

  protected convertDateFromClient(accountRecord: IAccountRecord): IAccountRecord {
    return Object.assign({}, accountRecord, {
      date: accountRecord.date?.isValid() ? accountRecord.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((accountRecord: IAccountRecord) => {
        accountRecord.date = accountRecord.date ? dayjs(accountRecord.date) : undefined;
      });
    }
    return res;
  }
}
