jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BudgetItemService } from '../service/budget-item.service';
import { IBudgetItem, BudgetItem } from '../budget-item.model';
import { IBudget } from 'app/entities/budget/budget.model';
import { BudgetService } from 'app/entities/budget/service/budget.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

import { BudgetItemUpdateComponent } from './budget-item-update.component';

describe('Component Tests', () => {
  describe('BudgetItem Management Update Component', () => {
    let comp: BudgetItemUpdateComponent;
    let fixture: ComponentFixture<BudgetItemUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let budgetItemService: BudgetItemService;
    let budgetService: BudgetService;
    let categoryService: CategoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BudgetItemUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BudgetItemUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BudgetItemUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      budgetItemService = TestBed.inject(BudgetItemService);
      budgetService = TestBed.inject(BudgetService);
      categoryService = TestBed.inject(CategoryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Budget query and add missing value', () => {
        const budgetItem: IBudgetItem = { id: 456 };
        const budget: IBudget = { id: 34267 };
        budgetItem.budget = budget;

        const budgetCollection: IBudget[] = [{ id: 73823 }];
        spyOn(budgetService, 'query').and.returnValue(of(new HttpResponse({ body: budgetCollection })));
        const additionalBudgets = [budget];
        const expectedCollection: IBudget[] = [...additionalBudgets, ...budgetCollection];
        spyOn(budgetService, 'addBudgetToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ budgetItem });
        comp.ngOnInit();

        expect(budgetService.query).toHaveBeenCalled();
        expect(budgetService.addBudgetToCollectionIfMissing).toHaveBeenCalledWith(budgetCollection, ...additionalBudgets);
        expect(comp.budgetsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Category query and add missing value', () => {
        const budgetItem: IBudgetItem = { id: 456 };
        const category: ICategory = { id: 68796 };
        budgetItem.category = category;

        const categoryCollection: ICategory[] = [{ id: 37540 }];
        spyOn(categoryService, 'query').and.returnValue(of(new HttpResponse({ body: categoryCollection })));
        const additionalCategories = [category];
        const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
        spyOn(categoryService, 'addCategoryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ budgetItem });
        comp.ngOnInit();

        expect(categoryService.query).toHaveBeenCalled();
        expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, ...additionalCategories);
        expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const budgetItem: IBudgetItem = { id: 456 };
        const budget: IBudget = { id: 7301 };
        budgetItem.budget = budget;
        const category: ICategory = { id: 70675 };
        budgetItem.category = category;

        activatedRoute.data = of({ budgetItem });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(budgetItem));
        expect(comp.budgetsSharedCollection).toContain(budget);
        expect(comp.categoriesSharedCollection).toContain(category);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const budgetItem = { id: 123 };
        spyOn(budgetItemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ budgetItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: budgetItem }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(budgetItemService.update).toHaveBeenCalledWith(budgetItem);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const budgetItem = new BudgetItem();
        spyOn(budgetItemService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ budgetItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: budgetItem }));
        saveSubject.complete();

        // THEN
        expect(budgetItemService.create).toHaveBeenCalledWith(budgetItem);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const budgetItem = { id: 123 };
        spyOn(budgetItemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ budgetItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(budgetItemService.update).toHaveBeenCalledWith(budgetItem);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBudgetById', () => {
        it('Should return tracked Budget primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBudgetById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCategoryById', () => {
        it('Should return tracked Category primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCategoryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
