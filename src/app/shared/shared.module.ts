// angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// package modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { RecaptchaModule } from 'ng-recaptcha';
// import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { PapaParseModule } from 'ngx-papaparse';
// local modules
import { MaterialModule } from './material.module';
// components
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ColorsComponent } from './colors/colors.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MailingListDialogComponent } from './mailing-list-dialog/mailing-list-dialog.component';
import { ViewListDialogComponent } from '#app/shared/view-list-dialog/view-list-dialog.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DesignerViewComponent } from './designer-view/designer-view.component';
import { SidebarTabComponent } from './designer-view/sidebar-tab.component';
import { FabricCanvasComponent } from '#app/shared/designer-view/fabric-canvas.component';

const modules: any[] = [
  // angular modules
  CommonModule,
  HttpModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  // package modules
  NgbModule,
  // RecaptchaModule,
  // RecaptchaFormsModule,
  ColorPickerModule,
  PapaParseModule,
  // local modules
  MaterialModule,
];

const components: any[] = [
  BreadcrumbsComponent,
  ColorsComponent,
  SidenavComponent,
  MailingListDialogComponent,
  ViewListDialogComponent,
  DesignerViewComponent,
  SidebarTabComponent,
  FabricCanvasComponent
];

const everything = modules.concat(components);

@NgModule({
  imports: modules,
  declarations: components,
  entryComponents: [MailingListDialogComponent, ViewListDialogComponent],
  exports: [
    // angular modules
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    // package modules
    NgbModule,
    // RecaptchaModule,
    // RecaptchaFormsModule,
    ColorPickerModule,
    // local modules
    MaterialModule,
    BreadcrumbsComponent,
    ColorsComponent,
    SidenavComponent,
    ContextMenuModule,
    DesignerViewComponent,
    SidebarTabComponent,
    FabricCanvasComponent
  ]
})
export class SharedModule { }
