import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICategoryRule, CategoryRule } from '../category-rule.model';

import { CategoryRuleService } from './category-rule.service';

describe('Service Tests', () => {
  describe('CategoryRule Service', () => {
    let service: CategoryRuleService;
    let httpMock: HttpTestingController;
    let elemDefault: ICategoryRule;
    let expectedResult: ICategoryRule | ICategoryRule[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CategoryRuleService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        match: 'AAAAAAA',
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

      it('should create a CategoryRule', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new CategoryRule()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CategoryRule', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            match: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a CategoryRule', () => {
        const patchObject = Object.assign(
          {
            match: 'BBBBBB',
          },
          new CategoryRule()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CategoryRule', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            match: 'BBBBBB',
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

      it('should delete a CategoryRule', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCategoryRuleToCollectionIfMissing', () => {
        it('should add a CategoryRule to an empty array', () => {
          const categoryRule: ICategoryRule = { id: 123 };
          expectedResult = service.addCategoryRuleToCollectionIfMissing([], categoryRule);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(categoryRule);
        });

        it('should not add a CategoryRule to an array that contains it', () => {
          const categoryRule: ICategoryRule = { id: 123 };
          const categoryRuleCollection: ICategoryRule[] = [
            {
              ...categoryRule,
            },
            { id: 456 },
          ];
          expectedResult = service.addCategoryRuleToCollectionIfMissing(categoryRuleCollection, categoryRule);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CategoryRule to an array that doesn't contain it", () => {
          const categoryRule: ICategoryRule = { id: 123 };
          const categoryRuleCollection: ICategoryRule[] = [{ id: 456 }];
          expectedResult = service.addCategoryRuleToCollectionIfMissing(categoryRuleCollection, categoryRule);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(categoryRule);
        });

        it('should add only unique CategoryRule to an array', () => {
          const categoryRuleArray: ICategoryRule[] = [{ id: 123 }, { id: 456 }, { id: 12137 }];
          const categoryRuleCollection: ICategoryRule[] = [{ id: 123 }];
          expectedResult = service.addCategoryRuleToCollectionIfMissing(categoryRuleCollection, ...categoryRuleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const categoryRule: ICategoryRule = { id: 123 };
          const categoryRule2: ICategoryRule = { id: 456 };
          expectedResult = service.addCategoryRuleToCollectionIfMissing([], categoryRule, categoryRule2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(categoryRule);
          expect(expectedResult).toContain(categoryRule2);
        });

        it('should accept null and undefined values', () => {
          const categoryRule: ICategoryRule = { id: 123 };
          expectedResult = service.addCategoryRuleToCollectionIfMissing([], null, categoryRule, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(categoryRule);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
