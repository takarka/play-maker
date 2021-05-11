import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/services/user.service';
import { Role } from 'src/app/shared/services/role';
import { User } from 'src/app/shared/services/user.model';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  currentUser: User;
  title: string;
  state: string;

  form: FormGroup;
  passForm: FormGroup;

  isChangePassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = 'Профиль';
    this.currentUser = this.userService.getAutenticatedUser();
  }

  get isSuperAdmin() {
    return this.currentUser.role === Role.SuperAdmin;
  }

  ngOnInit() {
    this.createForm();
    this.createPassForm();
    this.form.patchValue(this.currentUser);
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [null],
      email: [null, { validators: [Validators.required, Validators.email] }],
      password: [null, Validators.required],
      tenantId: [null, Validators.required],
      activeClubId: [null],
      role: [null],
      profile: this.formBuilder.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        phoneNumber: [null, Validators.required]
      })
    });
  }

  createPassForm() {
    this.passForm = this.formBuilder.group(
      {
        currentPass: [null, Validators.required],
        newPass: [null, Validators.required],
        confNewPass: [null, Validators.required]
      },
      { validator: this.checkPasswords }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.currentUser = this.form.value;
    this.userService.updateProfile(this.currentUser).then(() => {
      this.openSnackBar('', 'Профиль успешно обновлено!', 'successfull');
      this.dialogRef.close();
    });
  }

  onOpenPassView() {
    this.title = 'Пароль';
    this.isChangePassword = true;
  }

  onChangePass() {
    const oldPassword = this.passForm.get('currentPass').value;
    const newPassword = this.passForm.get('newPass').value;
    this.userService.updatePassword(this.currentUser.email, oldPassword, newPassword).then(() => {
      this.openSnackBar('', 'Пароль успешно изменен!', 'successfull');
      this.currentUser.password = newPassword;
      this.title = 'Профиль';
      this.isChangePassword = false;
    });
  }

  compareFn(c1: string, c2: string): boolean {
    return c1 && c2 ? c1 === c2 : false;
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const pass = group.controls['newPass'].value;
    const confirmPass = group.controls['confNewPass'].value;

    return pass === confirmPass ? null : group.get('confNewPass').setErrors({ NoPassswordMatch: true });
  }

  openSnackBar(objName: string, text: string, messageType: string) {
    this.snackBar.openFromComponent(MessageComponent, {
      data: {
        text: text,
        objName: objName
      },
      panelClass: 'successfull',
      duration: 2000
    });
  }
}
