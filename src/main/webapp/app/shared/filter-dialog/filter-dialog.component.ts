import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
  public fields: any[] = [];
  public validateForm: FormGroup;

  constructor(public activeModal: NgbActiveModal) {
    this.validateForm = new FormGroup({});
  }

  ngOnInit(): void {
    this._initFields();
  }

  confirm(): void {
    this._getFormValues();
    const values: any = {};
    this.fields.forEach((field: any) => {
      if (!this.validateForm.get(field.attribute)?.value) {
        return;
      }

      if (field.type === 'daterange') {
        const from = this.validateForm.get(`${field.attribute as string}_from`)?.value;
        const to = this.validateForm.get(`${field.attribute as string}_to`)?.value;
        if (from && to) {
          values[field.attribute] = from;
          values[field.attribute] = to;
        }
      } else {
        this.validateForm.addControl(field.attribute, new FormControl(field.value ?? null));
        values[field.attribute] = this.validateForm.get(field.attribute)?.value;
      }
    });

    if (Object.keys(values).length === 0) {
      this.activeModal.dismiss();
    }

    this.activeModal.close(values);
  }

  clear(): void {
    this.fields.forEach((field: any) => {
      if (field.type === 'daterange') {
        this.validateForm.get(`${field.attribute as string}_from`)?.setValue(null);
        this.validateForm.get(`${field.attribute as string}_to`)?.setValue(null);
      } else {
        this.validateForm.get(field.attribute)?.setValue(null);
      }
    });
    this.activeModal.close(null);
  }

  private _initFields(): void {
    this.fields.forEach((field: any) => {
      if (field.type === 'daterange') {
        this.validateForm.addControl(`${field.attribute as string}_from`, new FormControl(field.valueFrom ?? null));
        this.validateForm.addControl(`${field.attribute as string}_to`, new FormControl(field.valueTo ?? null));
      } else {
        this.validateForm.addControl(field.attribute, new FormControl(field.value ?? null));
      }
    });
  }

  private _getFormValues(): void {
    this.fields.forEach((field: any) => {
      if (field.type === 'daterange') {
        field.valueTo = this.validateForm.get([`${field.attribute as string}_to`])!.value ?? null;
        field.valueFrom = this.validateForm.get([`${field.attribute as string}_from`])!.value ?? null;
      } else {
        field.value = this.validateForm.get([field.attribute])!.value ?? null;
      }
    });
  }
}
