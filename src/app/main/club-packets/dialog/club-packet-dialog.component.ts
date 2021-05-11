import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HallService } from 'src/app/services/hall.service';
import { Hall } from '../../halls/hall.model';
import { ClubPacket } from '../club-packet.model';

@Component({
  selector: 'app-club-packet-dialog',
  templateUrl: './club-packet-dialog.component.html',
  styleUrls: ['./club-packet-dialog.component.scss']
})
export class ClubPacketDialogComponent implements OnInit {
  packet: ClubPacket;
  title: string;

  form: FormGroup;

  halls: Hall[] = [];
  activeClubId: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClubPacketDialogComponent>,
    private hallService: HallService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.row) {
      this.packet = data.row;
      this.title = 'Изменить';
    } else {
      this.packet = new ClubPacket();
      this.title = 'Новый пакет';
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
      clubId: [null],
      hall: [null, Validators.required],
      time: this.formBuilder.group({
        hour: [null, Validators.required],
        minute: [null, Validators.required],
        second: [0]
      }),
      cost: [null],
      description: [null]
    });
    this.form.patchValue(this.packet);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  compareFn(c1: Hall, c2: Hall): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
