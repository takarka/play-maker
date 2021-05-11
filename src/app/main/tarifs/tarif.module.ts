import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { TarifDialogComponent } from './dialog/tarif-dialog.component';
import { TarifRoutingModule } from './tarif-routing.module';
import { TarifComponent } from './tarif.component';

@NgModule({
  imports: [
    CommonModule,
    TarifRoutingModule,
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
    MatRadioModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [TarifComponent, TarifDialogComponent],
  entryComponents: [TarifDialogComponent]
})
export class TarifModule {}
