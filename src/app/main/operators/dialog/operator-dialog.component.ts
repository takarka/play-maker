import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TenantService } from 'src/app/services/tenant.service';
import { Role } from 'src/app/shared/services/role';
import { User } from 'src/app/shared/services/user.model';
import { Tenant } from '../../tenants/tenant.model';

@Component({
  selector: 'app-operator-dialog',
  templateUrl: './operator-dialog.component.html',
  styleUrls: ['./operator-dialog.component.scss']
})
export class OperatorDialogComponent implements OnInit {
  currentUser: User;
  selectedUser: User;
  title: string;
  state: string;

  tenants: Tenant[];

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private tenantService: TenantService,
    public dialogRef: MatDialogRef<OperatorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentUser = data && data.currentUser ? data.currentUser : new User();
    this.createForm();
    if (data && data.row) {
      this.selectedUser = data.row;
      this.title = 'Изменить';
      this.form.controls['email'].disable();
    } else {
      this.selectedUser = new User();
      this.selectedUser.role = this.isSuperAdmin ? Role.Admin : Role.Operator;
      this.selectedUser.tenantId = this.isSuperAdmin ? null : this.currentUser.tenantId;
      this.title = this.isSuperAdmin ? 'Новый админ' : 'Новый оператор';
    }
  }

  get isSuperAdmin() {
    return this.currentUser.role === Role.SuperAdmin;
  }

  ngOnInit() {
    this.tenantService.getAll().subscribe(items => {
      this.tenants = items;
      this.form.patchValue(this.selectedUser);
    });

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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.form.controls['email'].enable();
    this.selectedUser = this.form.value;
    this.dialogRef.close(this.selectedUser);
  }

  compareFn(c1: string, c2: string): boolean {
    return c1 && c2 ? c1 === c2 : false;
  }

  // checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  //     let pass = group.controls.password.value;
  //     let confirmPass = group.controls.confirmPass.value;

  //     return pass === confirmPass ? null : { notSame: true }
  // }
}
