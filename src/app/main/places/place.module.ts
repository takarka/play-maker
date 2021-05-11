import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { PlaceDialogComponent } from './dialog/place-dialog.component';
import { PlaceRoutingModule } from './place-routing.module';
import { PlaceComponent } from './place.component';

@NgModule({
  imports: [
    CommonModule,
    PlaceRoutingModule,
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
    MatSelectModule,
    MatOptionModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PlaceComponent, PlaceDialogComponent],
  entryComponents: [PlaceDialogComponent]
})
export class PlaceModule {}
