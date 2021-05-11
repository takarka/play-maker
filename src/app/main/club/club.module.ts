import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import { MatFormFieldModule, MatPaginatorModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { ClubRoutingModule } from './club-routing.module';
import { ClubComponent } from './club.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClubDialogComponent } from './dialog/club-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ClubRoutingModule,
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
    declarations: [ClubComponent, ClubDialogComponent],
    entryComponents: [
        ClubDialogComponent,
    ]
})
export class ClubModule {}
