import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatRadioChange } from '@angular/material';
import { MessageComponent } from 'src/app/layout/components/message/message.component';
import { HallService } from 'src/app/services/hall.service';
import { TarifService } from 'src/app/services/tarif.service';
import { TarifType } from 'src/app/shared/enums/tarifType.enum';
import { Hall } from '../../halls/hall.model';
import { Tarif } from '../tarif.model';
import { Time } from 'src/app/shared/models/time.model';
import { PrimaryTarifType } from 'src/app/shared/enums/primary-tarif-type.enum';

@Component({
  selector: 'app-tarif-dialog',
  templateUrl: './tarif-dialog.component.html',
  styleUrls: ['./tarif-dialog.component.scss']
})
export class TarifDialogComponent implements OnInit, AfterViewInit {
  tarif: Tarif;
  title: string;

  form: FormGroup;

  halls: Hall[] = [];
  activeClubId: string;
  tarifType: string;
  primaryType: string;

  Primary_Type = PrimaryTarifType;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TarifDialogComponent>,
    private hallService: HallService,
    private tarifService: TarifService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.row) {
      this.tarif = data.row;
      this.title = 'Изменить';
      this.tarifType = this.tarif.type;
      this.primaryType = this.tarif.primaryType;
    } else {
      this.tarif = new Tarif();
      this.title = 'Новый тариф';
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
      type: [null],
      primaryType: [null]
    });
    this.form.patchValue(this.tarif);

    if (this.primaryType) {
      this.primaryTypeControl.setValue(this.primaryType);
    } else {
    }
  }

  get primaryTypeControl() {
    return this.form.get('primaryType');
  }

  ngAfterViewInit(): void {}

  hallSelected(e: any) {
    const hall: Hall = e.value;
    this.tarifService.searchTarifsByHallAndType(this.activeClubId, hall.id, TarifType.PRIMARY).subscribe(items => {
      this.settingTarifType(items);
      if (this.isPrimary) {
        this.changeToPrimaryForm(hall.name);
      }
    });
  }

  settingTarifType(items: Tarif[]) {
    if (items && items.length > 0) {
      this.tarifType = TarifType.ORDINARY;
    } else {
      this.tarifType = TarifType.PRIMARY;
    }
  }

  primaryTypeChanged() {}

  get isPrimary() {
    return this.tarifType === TarifType.PRIMARY;
  }

  changeToPrimaryForm(hall_name: string) {
    const name: string = '1 час - ' + hall_name;
    this.form.get('name').setValue(name);
    this.form.get('time').setValue(new Time(1, 0, 0));
    // this.costField.nativeElement.focus();
    this.openSnackBar(hall_name, 'Установите к этому залу минимальный тариф', 'successfull');
  }

  onChange(mrChange: MatRadioChange) {
    const selectedOptionType = mrChange.value;
  }

  onSaveClick() {
    this.tarif = this.form.value;
    this.tarif.clubId = this.activeClubId;
    this.tarif.type = this.tarifType;
    this.dialogRef.close(this.tarif);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  openSnackBar(objName: string, text: string, messageType: string) {
    this.snackBar.openFromComponent(MessageComponent, {
      data: {
        text: text,
        objName: objName
      },
      panelClass: 'successfull',
      duration: 5000
    });
  }
}
