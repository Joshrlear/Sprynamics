// angular modules
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
// package modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
// import { RecaptchaModule } from 'ng-recaptcha';
// import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { ColorPickerModule } from 'ngx-color-picker'
import { PapaParseModule } from 'ngx-papaparse'
// local modules
import { MaterialModule } from './material.module'
// components
import { MailingListDialog } from './mailing-list-dialog/mailing-list.dialog'
import { ViewListDialog } from '#app/shared/view-list-dialog/view-list.dialog'
import { ContextMenuModule } from 'ngx-contextmenu'
import { ColorsComponent } from '#app/shared/colors/colors.component'
import { CropDialog } from '#app/shared/crop-dialog/crop.dialog';
import { EmailBuilderComponent } from './email-builder/email-builder.component';
import { LoadTemplateDialogComponent } from './email-builder/load-template-dialog/load-template-dialog.component';
import { SendMailDialogComponent } from './email-builder/send-mail-dialog/send-mail-dialog.component';

const modules = [
  CommonModule,
  HttpModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  NgbModule,
  ColorPickerModule,
  PapaParseModule,
  MaterialModule,
  ContextMenuModule
]

const components = [
  ColorsComponent,
]

const dialogs = [
  MailingListDialog,
  ViewListDialog,
  CropDialog,
  LoadTemplateDialogComponent
]

@NgModule({
  imports: modules,
  declarations: [...components, ...dialogs, EmailBuilderComponent, LoadTemplateDialogComponent, SendMailDialogComponent],
  entryComponents: [...dialogs],
  exports: [...modules, ...components, ...dialogs]
})
export class SharedModule {}
