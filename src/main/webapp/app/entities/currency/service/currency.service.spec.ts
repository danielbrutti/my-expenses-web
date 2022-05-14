import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICurrency, Currency } from '../currency.model';

import { CurrencyService } from './currency.service';

describe('Service Tests', () => {
  describe('Currency Service', () => {
    let service: CurrencyService;
    let httpMock: HttpTestingController;
    let elemDefault: ICurrency;
    let expectedResult: ICurrency | ICurrency[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CurrencyService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        currencyName: 'AAAAAAA',
        symbol: 'AAAAAAA',
        usdPrice: 0,
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

      it('should create a Currency', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Currency()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Currency', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            currencyName: 'BBBBBB',
            symbol: 'BBBBBB',
            usdPrice: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Currency', () => {
        const patchObject = Object.assign(
          {
            currencyName: 'BBBBBB',
            usdPrice: 1,
          },
          new Currency()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Currency', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            currencyName: 'BBBBBB',
            symbol: 'BBBBBB',
            usdPrice: 1,
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

      it('should delete a Currency', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCurrencyToCollectionIfMissing', () => {
        it('should add a Currency to an empty array', () => {
          const currency: ICurrency = { id: 123 };
          expectedResult = service.addCurrencyToCollectionIfMissing([], currency);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(currency);
        });

        it('should not add a Currency to an array that contains it', () => {
          const currency: ICurrency = { id: 123 };
          const currencyCollection: ICurrency[] = [
            {
              ...currency,
            },
            { id: 456 },
          ];
          expectedResult = service.addCurrencyToCollectionIfMissing(currencyCollection, currency);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Currency to an array that doesn't contain it", () => {
          const currency: ICurrency = { id: 123 };
          const currencyCollection: ICurrency[] = [{ id: 456 }];
          expectedResult = service.addCurrencyToCollectionIfMissing(currencyCollection, currency);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(currency);
        });

        it('should add only unique Currency to an array', () => {
          const currencyArray: ICurrency[] = [{ id: 123 }, { id: 456 }, { id: 12302 }];
          const currencyCollection: ICurrency[] = [{ id: 123 }];
          expectedResult = service.addCurrencyToCollectionIfMissing(currencyCollection, ...currencyArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const currency: ICurrency = { id: 123 };
          const currency2: ICurrency = { id: 456 };
          expectedResult = service.addCurrencyToCollectionIfMissing([], currency, currency2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(currency);
          expect(expectedResult).toContain(currency2);
        });

        it('should accept null and undefined values', () => {
          const currency: ICurrency = { id: 123 };
          expectedResult = service.addCurrencyToCollectionIfMissing([], null, currency, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(currency);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
