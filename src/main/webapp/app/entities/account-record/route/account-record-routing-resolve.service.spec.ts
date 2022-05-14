jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAccountRecord, AccountRecord } from '../account-record.model';
import { AccountRecordService } from '../service/account-record.service';

import { AccountRecordRoutingResolveService } from './account-record-routing-resolve.service';

describe('Service Tests', () => {
  describe('AccountRecord routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AccountRecordRoutingResolveService;
    let service: AccountRecordService;
    let resultAccountRecord: IAccountRecord | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AccountRecordRoutingResolveService);
      service = TestBed.inject(AccountRecordService);
      resultAccountRecord = undefined;
    });

    describe('resolve', () => {
      it('should return IAccountRecord returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccountRecord = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAccountRecord).toEqual({ id: 123 });
      });

      it('should return new IAccountRecord if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccountRecord = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAccountRecord).toEqual(new AccountRecord());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccountRecord = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAccountRecord).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
