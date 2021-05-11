import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatTableModule, MatToolbarModule, MatFormField } from '@angular/material';
import { ClubPacketRoutingModule } from './club-packet-routing.module';
import { ClubPacketComponent } from './club-packet.component';
import { ClubPacketDialogComponent } from './dialog/club-packet-dialog.component';
@NgModule({
    imports: [
        CommonModule,
        ClubPacketRoutingModule,
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
        MatOptionModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [ClubPacketComponent, ClubPacketDialogComponent],
    entryComponents: [
        ClubPacketDialogComponent,
    ]
})
export class ClubPacketModule {}
