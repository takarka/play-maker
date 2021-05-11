import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSnackBarModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';
import { TenantDialogComponent } from './dialog/tenant-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        TenantRoutingModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatSnackBarModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [TenantComponent, TenantDialogComponent],
    entryComponents: [
        TenantDialogComponent,
    ]
})
export class TenantModule {}
