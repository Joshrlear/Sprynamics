import { NgModule } from '@angular/core';
import { 
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule,
} from '@angular/material';

const modules = [
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }