jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BudgetService } from '../service/budget.service';
import { IBudget, Budget } from '../budget.model';

import { BudgetUpdateComponent } from './budget-update.component';

describe('Component Tests', () => {
  describe('Budget Management Update Component', () => {
    let comp: BudgetUpdateComponent;
    let fixture: ComponentFixture<BudgetUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let budgetService: BudgetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BudgetUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BudgetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BudgetUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      budgetService = TestBed.inject(BudgetService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const budget: IBudget = { id: 456 };

        activatedRoute.data = of({ budget });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(budget));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const budget = { id: 123 };
        spyOn(budgetService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ budget });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: budget }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(budgetService.update).toHaveBeenCalledWith(budget);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const budget = new Budget();
        spyOn(budgetService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ budget });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: budget }));
        saveSubject.complete();

        // THEN
        expect(budgetService.create).toHaveBeenCalledWith(budget);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const budget = { id: 123 };
        spyOn(budgetService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ budget });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(budgetService.update).toHaveBeenCalledWith(budget);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
