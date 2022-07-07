import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BudgetItemDetailComponent } from './budget-item-detail.component';

describe('Component Tests', () => {
  describe('BudgetItem Management Detail Component', () => {
    let comp: BudgetItemDetailComponent;
    let fixture: ComponentFixture<BudgetItemDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BudgetItemDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ budgetItem: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BudgetItemDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BudgetItemDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load budgetItem on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.budgetItem).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
