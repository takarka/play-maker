import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HallService } from 'src/app/services/hall.service';
import { Hall } from '../../halls/hall.model';
import { Place } from '../place.model';

@Component({
  selector: 'app-place-dialog',
  templateUrl: './place-dialog.component.html',
  styleUrls: ['./place-dialog.component.scss']
})
export class PlaceDialogComponent implements OnInit {
  place: Place;
  title: string;

  form: FormGroup;

  halls: Hall[] = [];
  activeClubId: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PlaceDialogComponent>,
    private hallService: HallService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.row) {
      this.place = data.row;
      this.title = 'Изменить';
    } else {
      this.place = new Place();
      this.title = 'Новый стол';
    }
    this.activeClubId = data ? data.activeClubId : null;
  }

  ngOnInit() {
    this.hallService.getHallsByClubId(this.activeClubId).subscribe(items => {
      this.halls = items;
    });

    this.form = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      active: [null],
      clubId: [null],
      hall: [null, Validators.required]
    });

    this.form.patchValue(this.place);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  compareFn(c1: Hall, c2: Hall): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
