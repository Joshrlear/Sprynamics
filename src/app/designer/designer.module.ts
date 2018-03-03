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

const routes: Routes = [
  { path: '', component: DesignerClientComponent },
  { path: 'admin', component: DesignerAdminComponent }
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
  ],
  entryComponents: [ 
    CropDialogComponent
  ],
  providers: [AlignmentService, ObjectFactoryService]
})
export class DesignerModule { }