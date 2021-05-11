import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { CountdownModule } from 'ngx-countdown';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { ShiftOrderDialogComponent } from './complete-dialog/shift-order-dialog.component';
import { ShiftOrderComponent } from './shift-order.component';
import { ShiftOrderRoutingModule } from './shift-order-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ShiftOrderRoutingModule,
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
    MatDividerModule,
    MatListModule,
    MatDatepickerModule,
    MatSortModule,
    MatTabsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CountdownModule,
    CountdownTimerModule.forRoot()
  ],
  declarations: [ShiftOrderComponent, ShiftOrderDialogComponent],
  entryComponents: [ShiftOrderDialogComponent]
})
export class ShiftOrderModule {}
