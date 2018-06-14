import { SharedModule } from '#app/shared/shared.module'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminComponent } from './admin/admin.component'
import { AddAgentDialog } from './agents/add-agent-dialog/add-agent.dialog'
import { AgentsComponent } from './agents/agents.component'
import { ImportAgentsDialog } from './agents/import-agents-dialog/import-agents.dialog'
import { ViewAgentComponent } from './agents/view-agent/view-agent.component'
import { DashboardComponent } from './dashboard.component'
import { ListsComponent } from './lists/lists.component'
import { OrdersComponent } from './orders/orders.component'
import { ProfileComponent } from './profile/profile.component'

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'agents', component: AgentsComponent },
  { path: 'agents/:agentId', component: ViewAgentComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'lists', component: ListsComponent },
  { path: 'admin', component: AdminComponent }
]

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [
    DashboardComponent,
    AgentsComponent,
    ListsComponent,
    OrdersComponent,
    ProfileComponent,
    AddAgentDialog,
    ViewAgentComponent,
    AdminComponent,
    ImportAgentsDialog
  ],
  entryComponents: [AddAgentDialog, ImportAgentsDialog]
})
export class DashboardModule {}
