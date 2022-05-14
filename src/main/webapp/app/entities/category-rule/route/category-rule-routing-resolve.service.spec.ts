jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICategoryRule, CategoryRule } from '../category-rule.model';
import { CategoryRuleService } from '../service/category-rule.service';

import { CategoryRuleRoutingResolveService } from './category-rule-routing-resolve.service';

describe('Service Tests', () => {
  describe('CategoryRule routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CategoryRuleRoutingResolveService;
    let service: CategoryRuleService;
    let resultCategoryRule: ICategoryRule | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CategoryRuleRoutingResolveService);
      service = TestBed.inject(CategoryRuleService);
      resultCategoryRule = undefined;
    });

    describe('resolve', () => {
      it('should return ICategoryRule returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCategoryRule = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCategoryRule).toEqual({ id: 123 });
      });

      it('should return new ICategoryRule if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCategoryRule = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCategoryRule).toEqual(new CategoryRule());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCategoryRule = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCategoryRule).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
