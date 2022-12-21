jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BudgetService } from '../service/budget.service';
import { BudgetCopyDialogComponent } from './budget-copy-dialog.component';

describe('Component Tests', () => {
  describe('Budget Management Copy Component', () => {
    let comp: BudgetCopyDialogComponent;
    let fixture: ComponentFixture<BudgetCopyDialogComponent>;
    let service: BudgetService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BudgetCopyDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(BudgetCopyDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BudgetCopyDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BudgetService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmCopy', () => {
      it('Should call copy service on confirmCopy', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'copy').and.returnValue(of({}));

          // WHEN
          comp.confirmCopy();
          tick();

          // THEN
          expect(service.copy).toHaveBeenCalledTimes(1);
          expect(mockActiveModal.close).toHaveBeenCalledWith('copied');
        })
      ));

      it('Should not call copy service on clear', () => {
        // GIVEN
        spyOn(service, 'copy');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.copy).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
