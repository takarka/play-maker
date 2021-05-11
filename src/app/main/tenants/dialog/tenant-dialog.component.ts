import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Tenant } from '../tenant.model';

@Component({
  selector: 'app-tenant-dialog',
  templateUrl: './tenant-dialog.component.html',
  styleUrls: ['./tenant-dialog.component.scss']
})
export class TenantDialogComponent implements OnInit {
  tenant: Tenant;
  title: string;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TenantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.row) {
      this.tenant = data.row;
      this.title = 'Изменить';
    } else {
      this.tenant = new Tenant();
      this.title = 'Новая организация';
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required]
    });
    this.form.patchValue(this.tenant);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
