jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CurrencyService } from '../service/currency.service';
import { ICurrency, Currency } from '../currency.model';

import { CurrencyUpdateComponent } from './currency-update.component';

describe('Component Tests', () => {
  describe('Currency Management Update Component', () => {
    let comp: CurrencyUpdateComponent;
    let fixture: ComponentFixture<CurrencyUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let currencyService: CurrencyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CurrencyUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CurrencyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CurrencyUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      currencyService = TestBed.inject(CurrencyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const currency: ICurrency = { id: 456 };

        activatedRoute.data = of({ currency });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(currency));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const currency = { id: 123 };
        spyOn(currencyService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ currency });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: currency }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(currencyService.update).toHaveBeenCalledWith(currency);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const currency = new Currency();
        spyOn(currencyService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ currency });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: currency }));
        saveSubject.complete();

        // THEN
        expect(currencyService.create).toHaveBeenCalledWith(currency);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const currency = { id: 123 };
        spyOn(currencyService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ currency });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(currencyService.update).toHaveBeenCalledWith(currency);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
