import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatToolbarModule, MatSnackBarModule, MatCardModule, MatDividerModule, MatExpansionModule } from '@angular/material';
import { MatFormFieldModule, MatPaginatorModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HallRoutingModule } from './hall-routing.module';
import { HallComponent } from './hall.component';
import { HallDialogComponent } from './dialog/hall-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        HallRoutingModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatCardModule,
        MatDividerModule,
        MatExpansionModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [HallComponent, HallDialogComponent],
    entryComponents: [
        HallDialogComponent,
    ]
})
export class HallModule {}
