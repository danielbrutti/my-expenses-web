jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMoneyAccount, MoneyAccount } from '../money-account.model';
import { MoneyAccountService } from '../service/money-account.service';

import { MoneyAccountRoutingResolveService } from './money-account-routing-resolve.service';

describe('Service Tests', () => {
  describe('MoneyAccount routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MoneyAccountRoutingResolveService;
    let service: MoneyAccountService;
    let resultMoneyAccount: IMoneyAccount | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MoneyAccountRoutingResolveService);
      service = TestBed.inject(MoneyAccountService);
      resultMoneyAccount = undefined;
    });

    describe('resolve', () => {
      it('should return IMoneyAccount returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMoneyAccount = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMoneyAccount).toEqual({ id: 123 });
      });

      it('should return new IMoneyAccount if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMoneyAccount = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMoneyAccount).toEqual(new MoneyAccount());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMoneyAccount = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMoneyAccount).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
