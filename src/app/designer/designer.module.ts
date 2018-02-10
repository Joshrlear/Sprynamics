import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '#app/shared/shared.module';

import { DesignerAdminComponent } from './admin/designer-admin.component';
import { DesignerClientComponent } from './client/designer-client.component';
import { CropDialogComponent } from './crop-dialog/crop-dialog.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContactInfoComponent } from './sidebar/contact-info/contact-info.component';
import { DesignsComponent } from './sidebar/designs/designs.component';
import { PhotosComponent } from './sidebar/photos/photos.component';
import { TextComponent } from './sidebar/text/text.component';

import { AlignmentService } from './admin/alignment.service';
import { ObjectFactoryService } from './object-factory.service';


@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  declarations: [
    DesignerAdminComponent,
    DesignerClientComponent,
    CropDialogComponent,
    SidebarComponent,
    ContactInfoComponent,
    DesignsComponent,
    PhotosComponent,
    TextComponent,
  ],
  entryComponents: [ 
    CropDialogComponent
  ],
  providers: [AlignmentService, ObjectFactoryService]
})
export class DesignerModule { }