import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { AccountRecordType } from 'app/entities/enumerations/account-record-type.model';
import { IAccountRecord, AccountRecord } from '../account-record.model';

import { AccountRecordService } from './account-record.service';

describe('Service Tests', () => {
  describe('AccountRecord Service', () => {
    let service: AccountRecordService;
    let httpMock: HttpTestingController;
    let elemDefault: IAccountRecord;
    let expectedResult: IAccountRecord | IAccountRecord[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AccountRecordService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        amount: 0,
        type: AccountRecordType.INCOME,
        notes: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a AccountRecord', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new AccountRecord()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AccountRecord', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            amount: 1,
            type: 'BBBBBB',
            notes: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a AccountRecord', () => {
        const patchObject = Object.assign(
          {
            amount: 1,
            type: 'BBBBBB',
          },
          new AccountRecord()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AccountRecord', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            amount: 1,
            type: 'BBBBBB',
            notes: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a AccountRecord', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAccountRecordToCollectionIfMissing', () => {
        it('should add a AccountRecord to an empty array', () => {
          const accountRecord: IAccountRecord = { id: 123 };
          expectedResult = service.addAccountRecordToCollectionIfMissing([], accountRecord);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(accountRecord);
        });

        it('should not add a AccountRecord to an array that contains it', () => {
          const accountRecord: IAccountRecord = { id: 123 };
          const accountRecordCollection: IAccountRecord[] = [
            {
              ...accountRecord,
            },
            { id: 456 },
          ];
          expectedResult = service.addAccountRecordToCollectionIfMissing(accountRecordCollection, accountRecord);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AccountRecord to an array that doesn't contain it", () => {
          const accountRecord: IAccountRecord = { id: 123 };
          const accountRecordCollection: IAccountRecord[] = [{ id: 456 }];
          expectedResult = service.addAccountRecordToCollectionIfMissing(accountRecordCollection, accountRecord);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(accountRecord);
        });

        it('should add only unique AccountRecord to an array', () => {
          const accountRecordArray: IAccountRecord[] = [{ id: 123 }, { id: 456 }, { id: 46691 }];
          const accountRecordCollection: IAccountRecord[] = [{ id: 123 }];
          expectedResult = service.addAccountRecordToCollectionIfMissing(accountRecordCollection, ...accountRecordArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const accountRecord: IAccountRecord = { id: 123 };
          const accountRecord2: IAccountRecord = { id: 456 };
          expectedResult = service.addAccountRecordToCollectionIfMissing([], accountRecord, accountRecord2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(accountRecord);
          expect(expectedResult).toContain(accountRecord2);
        });

        it('should accept null and undefined values', () => {
          const accountRecord: IAccountRecord = { id: 123 };
          expectedResult = service.addAccountRecordToCollectionIfMissing([], null, accountRecord, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(accountRecord);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
