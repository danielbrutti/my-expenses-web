jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CategoryRuleService } from '../service/category-rule.service';
import { ICategoryRule, CategoryRule } from '../category-rule.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

import { CategoryRuleUpdateComponent } from './category-rule-update.component';

describe('Component Tests', () => {
  describe('CategoryRule Management Update Component', () => {
    let comp: CategoryRuleUpdateComponent;
    let fixture: ComponentFixture<CategoryRuleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let categoryRuleService: CategoryRuleService;
    let categoryService: CategoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CategoryRuleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CategoryRuleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoryRuleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      categoryRuleService = TestBed.inject(CategoryRuleService);
      categoryService = TestBed.inject(CategoryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call category query and add missing value', () => {
        const categoryRule: ICategoryRule = { id: 456 };
        const category: ICategory = { id: 47527 };
        categoryRule.category = category;

        const categoryCollection: ICategory[] = [{ id: 31264 }];
        spyOn(categoryService, 'query').and.returnValue(of(new HttpResponse({ body: categoryCollection })));
        const expectedCollection: ICategory[] = [category, ...categoryCollection];
        spyOn(categoryService, 'addCategoryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ categoryRule });
        comp.ngOnInit();

        expect(categoryService.query).toHaveBeenCalled();
        expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(categoryCollection, category);
        expect(comp.categoriesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const categoryRule: ICategoryRule = { id: 456 };
        const category: ICategory = { id: 80199 };
        categoryRule.category = category;

        activatedRoute.data = of({ categoryRule });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(categoryRule));
        expect(comp.categoriesCollection).toContain(category);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const categoryRule = { id: 123 };
        spyOn(categoryRuleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ categoryRule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: categoryRule }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(categoryRuleService.update).toHaveBeenCalledWith(categoryRule);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const categoryRule = new CategoryRule();
        spyOn(categoryRuleService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ categoryRule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: categoryRule }));
        saveSubject.complete();

        // THEN
        expect(categoryRuleService.create).toHaveBeenCalledWith(categoryRule);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const categoryRule = { id: 123 };
        spyOn(categoryRuleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ categoryRule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(categoryRuleService.update).toHaveBeenCalledWith(categoryRule);
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
    });
  });
});
