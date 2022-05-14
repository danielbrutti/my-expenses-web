jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MoneyAccountService } from '../service/money-account.service';
import { IMoneyAccount, MoneyAccount } from '../money-account.model';
import { ICurrency } from 'app/entities/currency/currency.model';
import { CurrencyService } from 'app/entities/currency/service/currency.service';

import { MoneyAccountUpdateComponent } from './money-account-update.component';

describe('Component Tests', () => {
  describe('MoneyAccount Management Update Component', () => {
    let comp: MoneyAccountUpdateComponent;
    let fixture: ComponentFixture<MoneyAccountUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let moneyAccountService: MoneyAccountService;
    let currencyService: CurrencyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MoneyAccountUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MoneyAccountUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MoneyAccountUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      moneyAccountService = TestBed.inject(MoneyAccountService);
      currencyService = TestBed.inject(CurrencyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Currency query and add missing value', () => {
        const moneyAccount: IMoneyAccount = { id: 456 };
        const currency: ICurrency = { id: 33149 };
        moneyAccount.currency = currency;

        const currencyCollection: ICurrency[] = [{ id: 83760 }];
        spyOn(currencyService, 'query').and.returnValue(of(new HttpResponse({ body: currencyCollection })));
        const additionalCurrencies = [currency];
        const expectedCollection: ICurrency[] = [...additionalCurrencies, ...currencyCollection];
        spyOn(currencyService, 'addCurrencyToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ moneyAccount });
        comp.ngOnInit();

        expect(currencyService.query).toHaveBeenCalled();
        expect(currencyService.addCurrencyToCollectionIfMissing).toHaveBeenCalledWith(currencyCollection, ...additionalCurrencies);
        expect(comp.currenciesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const moneyAccount: IMoneyAccount = { id: 456 };
        const currency: ICurrency = { id: 13850 };
        moneyAccount.currency = currency;

        activatedRoute.data = of({ moneyAccount });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(moneyAccount));
        expect(comp.currenciesSharedCollection).toContain(currency);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const moneyAccount = { id: 123 };
        spyOn(moneyAccountService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ moneyAccount });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: moneyAccount }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(moneyAccountService.update).toHaveBeenCalledWith(moneyAccount);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const moneyAccount = new MoneyAccount();
        spyOn(moneyAccountService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ moneyAccount });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: moneyAccount }));
        saveSubject.complete();

        // THEN
        expect(moneyAccountService.create).toHaveBeenCalledWith(moneyAccount);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const moneyAccount = { id: 123 };
        spyOn(moneyAccountService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ moneyAccount });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(moneyAccountService.update).toHaveBeenCalledWith(moneyAccount);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCurrencyById', () => {
        it('Should return tracked Currency primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCurrencyById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
