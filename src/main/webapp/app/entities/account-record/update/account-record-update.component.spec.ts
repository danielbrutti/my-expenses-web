jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AccountRecordService } from '../service/account-record.service';
import { IAccountRecord, AccountRecord } from '../account-record.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IMoneyAccount } from 'app/entities/money-account/money-account.model';
import { MoneyAccountService } from 'app/entities/money-account/service/money-account.service';

import { AccountRecordUpdateComponent } from './account-record-update.component';

describe('Component Tests', () => {
  describe('AccountRecord Management Update Component', () => {
    let comp: AccountRecordUpdateComponent;
    let fixture: ComponentFixture<AccountRecordUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let accountRecordService: AccountRecordService;
    let categoryService: CategoryService;
    let moneyAccountService: MoneyAccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AccountRecordUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AccountRecordUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AccountRecordUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      accountRecordService = TestBed.inject(AccountRecordService);
      categoryService = TestBed.inject(CategoryService);
      moneyAccountService = TestBed.inject(MoneyAccountService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Category query and add missing value', () => {
        const accountRecord: IAccountRecord = { id: 456 };
        const category: ICategory = { id: 5599 };
        accountRecord.category = category;

        const categoryCollection: ICategory[] = [{ id: 73560 }];
        spyOn(categoryService, 'query').and.returnValue(of(new HttpResponse({ body: categoryCollection })));
        const additionalCategories = [category];
        const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
        spyOn(categoryService, 'addCategoryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ accountRecord });
        comp.ngOnInit();

        expect(categoryService.query).toHaveBeenCalled();
        expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, ...additionalCategories);
        expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call MoneyAccount query and add missing value', () => {
        const accountRecord: IAccountRecord = { id: 456 };
        const account: IMoneyAccount = { id: 28818 };
        accountRecord.account = account;

        const moneyAccountCollection: IMoneyAccount[] = [{ id: 4369 }];
        spyOn(moneyAccountService, 'query').and.returnValue(of(new HttpResponse({ body: moneyAccountCollection })));
        const additionalMoneyAccounts = [account];
        const expectedCollection: IMoneyAccount[] = [...additionalMoneyAccounts, ...moneyAccountCollection];
        spyOn(moneyAccountService, 'addMoneyAccountToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ accountRecord });
        comp.ngOnInit();

        expect(moneyAccountService.query).toHaveBeenCalled();
        expect(moneyAccountService.addMoneyAccountToCollectionIfMissing).toHaveBeenCalledWith(
          moneyAccountCollection,
          ...additionalMoneyAccounts
        );
        expect(comp.moneyAccountsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const accountRecord: IAccountRecord = { id: 456 };
        const category: ICategory = { id: 96845 };
        accountRecord.category = category;
        const account: IMoneyAccount = { id: 32351 };
        accountRecord.account = account;

        activatedRoute.data = of({ accountRecord });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(accountRecord));
        expect(comp.categoriesSharedCollection).toContain(category);
        expect(comp.moneyAccountsSharedCollection).toContain(account);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const accountRecord = { id: 123 };
        spyOn(accountRecordService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ accountRecord });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: accountRecord }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(accountRecordService.update).toHaveBeenCalledWith(accountRecord);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const accountRecord = new AccountRecord();
        spyOn(accountRecordService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ accountRecord });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: accountRecord }));
        saveSubject.complete();

        // THEN
        expect(accountRecordService.create).toHaveBeenCalledWith(accountRecord);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const accountRecord = { id: 123 };
        spyOn(accountRecordService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ accountRecord });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(accountRecordService.update).toHaveBeenCalledWith(accountRecord);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCategoryById', () => {
        it('Should return tracked Category primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCategoryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackMoneyAccountById', () => {
        it('Should return tracked MoneyAccount primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMoneyAccountById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
