import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatToolbarModule, MatSnackBarModule, MatSelectModule } from '@angular/material';
import { MatFormFieldModule, MatPaginatorModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperatorRoutingModule } from './operator-routing.module';
import { OperatorComponent } from './operator.component';
import { OperatorDialogComponent } from './dialog/operator-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        OperatorRoutingModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatSelectModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [OperatorComponent, OperatorDialogComponent],
    entryComponents: [
        OperatorDialogComponent,
    ]
})
export class OperatorModule {}
