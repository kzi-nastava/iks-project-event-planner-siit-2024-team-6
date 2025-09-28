import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';

export interface PriceEditData {
  offerPrice: number;
  offerDiscountPrice: number;
}

@Component({
  selector: 'app-price-edit-dialog',
  templateUrl: './price-edit-dialog.component.html',
  styleUrl: './price-edit-dialog.component.css'
})
export class PriceEditDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PriceEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PriceEditData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      offerPrice: [data.offerPrice, [Validators.required, Validators.min(0)]],
      offerDiscountPrice: [data.offerDiscountPrice, [Validators.min(0)]],
    }, {
      validators: this.saleLessThanPriceValidator
    });
  }

  saleLessThanPriceValidator(form: FormGroup): ValidationErrors | null {
    const price = form.get('offerPrice')?.value;
    const sale = form.get('offerDiscountPrice')?.value;

    if (sale != null && price != null && sale >= price) {
      return { saleNotLessThanPrice: true };
    }
    return null;
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
