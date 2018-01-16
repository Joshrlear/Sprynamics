import { NgModule } from '@angular/core';
import { 
  MatButtonModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule
} from '@angular/material';

const modules = [
  MatButtonModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }