import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountType } from 'app/entities/enumerations/account-type.model';
import { IMoneyAccount, MoneyAccount } from '../money-account.model';

import { MoneyAccountService } from './money-account.service';

describe('Service Tests', () => {
  describe('MoneyAccount Service', () => {
    let service: MoneyAccountService;
    let httpMock: HttpTestingController;
    let elemDefault: IMoneyAccount;
    let expectedResult: IMoneyAccount | IMoneyAccount[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MoneyAccountService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        accountName: 'AAAAAAA',
        initialBalance: 0,
        accountType: AccountType.TRANSACTIONAL,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a MoneyAccount', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new MoneyAccount()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a MoneyAccount', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            accountName: 'BBBBBB',
            initialBalance: 1,
            accountType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a MoneyAccount', () => {
        const patchObject = Object.assign(
          {
            accountName: 'BBBBBB',
            initialBalance: 1,
            accountType: 'BBBBBB',
          },
          new MoneyAccount()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of MoneyAccount', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            accountName: 'BBBBBB',
            initialBalance: 1,
            accountType: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a MoneyAccount', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMoneyAccountToCollectionIfMissing', () => {
        it('should add a MoneyAccount to an empty array', () => {
          const moneyAccount: IMoneyAccount = { id: 123 };
          expectedResult = service.addMoneyAccountToCollectionIfMissing([], moneyAccount);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(moneyAccount);
        });

        it('should not add a MoneyAccount to an array that contains it', () => {
          const moneyAccount: IMoneyAccount = { id: 123 };
          const moneyAccountCollection: IMoneyAccount[] = [
            {
              ...moneyAccount,
            },
            { id: 456 },
          ];
          expectedResult = service.addMoneyAccountToCollectionIfMissing(moneyAccountCollection, moneyAccount);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a MoneyAccount to an array that doesn't contain it", () => {
          const moneyAccount: IMoneyAccount = { id: 123 };
          const moneyAccountCollection: IMoneyAccount[] = [{ id: 456 }];
          expectedResult = service.addMoneyAccountToCollectionIfMissing(moneyAccountCollection, moneyAccount);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(moneyAccount);
        });

        it('should add only unique MoneyAccount to an array', () => {
          const moneyAccountArray: IMoneyAccount[] = [{ id: 123 }, { id: 456 }, { id: 67766 }];
          const moneyAccountCollection: IMoneyAccount[] = [{ id: 123 }];
          expectedResult = service.addMoneyAccountToCollectionIfMissing(moneyAccountCollection, ...moneyAccountArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const moneyAccount: IMoneyAccount = { id: 123 };
          const moneyAccount2: IMoneyAccount = { id: 456 };
          expectedResult = service.addMoneyAccountToCollectionIfMissing([], moneyAccount, moneyAccount2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(moneyAccount);
          expect(expectedResult).toContain(moneyAccount2);
        });

        it('should accept null and undefined values', () => {
          const moneyAccount: IMoneyAccount = { id: 123 };
          expectedResult = service.addMoneyAccountToCollectionIfMissing([], null, moneyAccount, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(moneyAccount);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
