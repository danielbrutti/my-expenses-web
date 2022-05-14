import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MoneyAccountDetailComponent } from './money-account-detail.component';

describe('Component Tests', () => {
  describe('MoneyAccount Management Detail Component', () => {
    let comp: MoneyAccountDetailComponent;
    let fixture: ComponentFixture<MoneyAccountDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MoneyAccountDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ moneyAccount: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MoneyAccountDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MoneyAccountDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load moneyAccount on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.moneyAccount).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
