import { NgModule } from '@angular/core';
import { 
  MatButtonModule
} from '@angular/material';

const modules = [
  MatButtonModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }