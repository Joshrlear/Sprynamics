import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '#app/shared/shared.module';

import { DesignerAdminComponent } from './admin/designer-admin.component';
import { DesignerClientComponent } from './client/designer-client.component';
import { CropDialogComponent } from './crop-dialog/crop-dialog.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AgentInfoComponent } from './sidebar/agent-info/agent-info.component';
import { DesignsComponent } from './sidebar/designs/designs.component';
import { PropertyComponent } from './sidebar/property/property.component';
import { TextComponent } from './sidebar/text/text.component';

import { AlignmentService } from './admin/alignment.service';
import { ObjectFactoryService } from './object-factory.service';
import { NewUserPopupComponent } from './new-user-popup/new-user-popup.component';
import { ImageSelectDialogComponent } from './image-select-dialog/image-select-dialog.component';
import { AdminDesignerProgressDialogComponent } from './admin/admin-designer-progress-dialog/admin-designer-progress-dialog.component';
import { DesignerdevComponent } from '#app/designerdev/designerdev.component';

const routes: Routes = [
  { path: '', component: DesignerClientComponent },
  { path: 'admin', component: DesignerAdminComponent },
  { path: 'dev', component: DesignerdevComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    DesignerAdminComponent,
    DesignerClientComponent,
    CropDialogComponent,
    SidebarComponent,
    AgentInfoComponent,
    DesignsComponent,
    PropertyComponent,
    TextComponent,
    NewUserPopupComponent,
    ImageSelectDialogComponent,
    AdminDesignerProgressDialogComponent,
    DesignerdevComponent,
  ],
  entryComponents: [
    CropDialogComponent,
    NewUserPopupComponent,
    ImageSelectDialogComponent,
    AdminDesignerProgressDialogComponent
  ],
  providers: [AlignmentService, ObjectFactoryService]
})
export class DesignerModule { }