jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBudget, Budget } from '../budget.model';
import { BudgetService } from '../service/budget.service';

import { BudgetRoutingResolveService } from './budget-routing-resolve.service';

describe('Service Tests', () => {
  describe('Budget routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BudgetRoutingResolveService;
    let service: BudgetService;
    let resultBudget: IBudget | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BudgetRoutingResolveService);
      service = TestBed.inject(BudgetService);
      resultBudget = undefined;
    });

    describe('resolve', () => {
      it('should return IBudget returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBudget = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBudget).toEqual({ id: 123 });
      });

      it('should return new IBudget if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBudget = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBudget).toEqual(new Budget());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBudget = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBudget).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
