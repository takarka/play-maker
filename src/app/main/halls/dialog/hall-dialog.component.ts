import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Hall } from '../hall.model';

@Component({
  selector: 'app-hall-dialog',
  templateUrl: './hall-dialog.component.html',
  styleUrls: ['./hall-dialog.component.scss']
})
export class HallDialogComponent implements OnInit {
  hall: Hall;
  title: string;

  form: FormGroup;
  gamePlacesFromArray: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<HallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.row) {
      this.hall = data.row;
      this.title = 'Изменить';
    } else {
      this.hall = new Hall();
      this.title = 'Новый зал';
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      clubId: [null]
      // gamePlaces: this.formBuilder.array([ this.createGamePlaces() ])
    });
    this.form.patchValue(this.hall);
  }

  // createGamePlaces(): FormGroup {
  //     return this.formBuilder.group({
  //         name: [null, Validators.required],
  //     });
  // }

  // addGamePlace(): void {
  //     this.gamePlacesFromArray = this.form.get('gamePlaces') as FormArray;
  //     this.gamePlacesFromArray.push(this.createGamePlaces());
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
