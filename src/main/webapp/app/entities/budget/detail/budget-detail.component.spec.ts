import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BudgetDetailComponent } from './budget-detail.component';

describe('Component Tests', () => {
  describe('Budget Management Detail Component', () => {
    let comp: BudgetDetailComponent;
    let fixture: ComponentFixture<BudgetDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BudgetDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ budget: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BudgetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BudgetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load budget on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.budget).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
