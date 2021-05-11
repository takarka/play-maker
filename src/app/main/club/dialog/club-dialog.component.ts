import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Club } from '../club.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-club-dialog',
  templateUrl: './club-dialog.component.html',
  styleUrls: ['./club-dialog.component.scss']
})
export class ClubDialogComponent implements OnInit {
  club: Club;
  title: string;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClubDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.row) {
      this.club = data.row;
      this.title = 'Изменить';
    } else {
      this.club = new Club();
      this.title = 'Новый клуб';
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      tenantId: [null],
      address: this.formBuilder.group({
        city: [null, Validators.required],
        region: [null, Validators.required],
        street: [null, Validators.required],
        houseNumber: [null, Validators.required]
      }),
      timeRange: this.formBuilder.group({
        dayStart: [null, Validators.required],
        nightStart: [null, Validators.required],
      }),
    });
    this.form.patchValue(this.club);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
