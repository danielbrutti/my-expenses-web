import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CurrencyDetailComponent } from './currency-detail.component';

describe('Component Tests', () => {
  describe('Currency Management Detail Component', () => {
    let comp: CurrencyDetailComponent;
    let fixture: ComponentFixture<CurrencyDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CurrencyDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ currency: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CurrencyDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CurrencyDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load currency on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.currency).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
