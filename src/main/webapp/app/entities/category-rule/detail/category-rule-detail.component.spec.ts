import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CategoryRuleDetailComponent } from './category-rule-detail.component';

describe('Component Tests', () => {
  describe('CategoryRule Management Detail Component', () => {
    let comp: CategoryRuleDetailComponent;
    let fixture: ComponentFixture<CategoryRuleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CategoryRuleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ categoryRule: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CategoryRuleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoryRuleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load categoryRule on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categoryRule).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
