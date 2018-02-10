// angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// package modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { ColorPickerModule } from 'ngx-color-picker';
// local modules
import { MaterialModule } from './material.module';
// components
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ColorsComponent } from './colors/colors.component';
import { SidenavComponent } from './sidenav/sidenav.component';

const modules: any[] = [
  // angular modules
  CommonModule,
  HttpModule,
  FormsModule,
  ReactiveFormsModule,
  // package modules
  NgbModule,
  RecaptchaFormsModule,
  ColorPickerModule,
  // local modules
  MaterialModule,
];

const components: any[] = [
  BreadcrumbsComponent,
  ColorsComponent,
  SidenavComponent,
];

const everything = modules.concat(components);

@NgModule({
  imports: modules,
  declarations: components,
  exports: [
    // angular modules
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    // package modules
    NgbModule,
    RecaptchaFormsModule,
    ColorPickerModule,
    // local modules
    MaterialModule,
    BreadcrumbsComponent,
    ColorsComponent,
    SidenavComponent,
  ]
})
export class SharedModule { }
