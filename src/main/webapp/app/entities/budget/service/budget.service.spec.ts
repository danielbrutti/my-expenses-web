import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBudget, Budget } from '../budget.model';

import { BudgetService } from './budget.service';

describe('Service Tests', () => {
  describe('Budget Service', () => {
    let service: BudgetService;
    let httpMock: HttpTestingController;
    let elemDefault: IBudget;
    let expectedResult: IBudget | IBudget[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BudgetService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        yearMonth: 'AAAAAAA',
        date: currentDate,
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

      it('should create a Budget', () => {
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

        service.create(new Budget()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Budget', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            yearMonth: 'BBBBBB',
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

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Budget', () => {
        const patchObject = Object.assign(
          {
            yearMonth: 'BBBBBB',
          },
          new Budget()
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

      it('should return a list of Budget', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            yearMonth: 'BBBBBB',
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

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Budget', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBudgetToCollectionIfMissing', () => {
        it('should add a Budget to an empty array', () => {
          const budget: IBudget = { id: 123 };
          expectedResult = service.addBudgetToCollectionIfMissing([], budget);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(budget);
        });

        it('should not add a Budget to an array that contains it', () => {
          const budget: IBudget = { id: 123 };
          const budgetCollection: IBudget[] = [
            {
              ...budget,
            },
            { id: 456 },
          ];
          expectedResult = service.addBudgetToCollectionIfMissing(budgetCollection, budget);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Budget to an array that doesn't contain it", () => {
          const budget: IBudget = { id: 123 };
          const budgetCollection: IBudget[] = [{ id: 456 }];
          expectedResult = service.addBudgetToCollectionIfMissing(budgetCollection, budget);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(budget);
        });

        it('should add only unique Budget to an array', () => {
          const budgetArray: IBudget[] = [{ id: 123 }, { id: 456 }, { id: 82398 }];
          const budgetCollection: IBudget[] = [{ id: 123 }];
          expectedResult = service.addBudgetToCollectionIfMissing(budgetCollection, ...budgetArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const budget: IBudget = { id: 123 };
          const budget2: IBudget = { id: 456 };
          expectedResult = service.addBudgetToCollectionIfMissing([], budget, budget2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(budget);
          expect(expectedResult).toContain(budget2);
        });

        it('should accept null and undefined values', () => {
          const budget: IBudget = { id: 123 };
          expectedResult = service.addBudgetToCollectionIfMissing([], null, budget, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(budget);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
