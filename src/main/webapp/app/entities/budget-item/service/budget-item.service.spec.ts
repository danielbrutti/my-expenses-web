import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBudgetItem, BudgetItem } from '../budget-item.model';

import { BudgetItemService } from './budget-item.service';

describe('Service Tests', () => {
  describe('BudgetItem Service', () => {
    let service: BudgetItemService;
    let httpMock: HttpTestingController;
    let elemDefault: IBudgetItem;
    let expectedResult: IBudgetItem | IBudgetItem[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BudgetItemService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        amount: 0,
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

      it('should create a BudgetItem', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new BudgetItem()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BudgetItem', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            amount: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BudgetItem', () => {
        const patchObject = Object.assign(
          {
            amount: 1,
          },
          new BudgetItem()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BudgetItem', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            amount: 1,
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

      it('should delete a BudgetItem', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBudgetItemToCollectionIfMissing', () => {
        it('should add a BudgetItem to an empty array', () => {
          const budgetItem: IBudgetItem = { id: 123 };
          expectedResult = service.addBudgetItemToCollectionIfMissing([], budgetItem);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(budgetItem);
        });

        it('should not add a BudgetItem to an array that contains it', () => {
          const budgetItem: IBudgetItem = { id: 123 };
          const budgetItemCollection: IBudgetItem[] = [
            {
              ...budgetItem,
            },
            { id: 456 },
          ];
          expectedResult = service.addBudgetItemToCollectionIfMissing(budgetItemCollection, budgetItem);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BudgetItem to an array that doesn't contain it", () => {
          const budgetItem: IBudgetItem = { id: 123 };
          const budgetItemCollection: IBudgetItem[] = [{ id: 456 }];
          expectedResult = service.addBudgetItemToCollectionIfMissing(budgetItemCollection, budgetItem);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(budgetItem);
        });

        it('should add only unique BudgetItem to an array', () => {
          const budgetItemArray: IBudgetItem[] = [{ id: 123 }, { id: 456 }, { id: 30008 }];
          const budgetItemCollection: IBudgetItem[] = [{ id: 123 }];
          expectedResult = service.addBudgetItemToCollectionIfMissing(budgetItemCollection, ...budgetItemArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const budgetItem: IBudgetItem = { id: 123 };
          const budgetItem2: IBudgetItem = { id: 456 };
          expectedResult = service.addBudgetItemToCollectionIfMissing([], budgetItem, budgetItem2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(budgetItem);
          expect(expectedResult).toContain(budgetItem2);
        });

        it('should accept null and undefined values', () => {
          const budgetItem: IBudgetItem = { id: 123 };
          expectedResult = service.addBudgetItemToCollectionIfMissing([], null, budgetItem, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(budgetItem);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
