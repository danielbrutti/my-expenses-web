import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountRecordDetailComponent } from './account-record-detail.component';

describe('Component Tests', () => {
  describe('AccountRecord Management Detail Component', () => {
    let comp: AccountRecordDetailComponent;
    let fixture: ComponentFixture<AccountRecordDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AccountRecordDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ accountRecord: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AccountRecordDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AccountRecordDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load accountRecord on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.accountRecord).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
