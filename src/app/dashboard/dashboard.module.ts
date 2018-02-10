import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '#app/shared/shared.module';

import { DashboardComponent } from './dashboard.component';
import { AgentsComponent } from './agents/agents.component';
import { DesignComponent } from './design/design.component';
import { ListsComponent } from './lists/lists.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'agents', component: AgentsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'lists', component: ListsComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DashboardComponent,
    AgentsComponent,
    DesignComponent,
    ListsComponent,
    OrdersComponent,
    ProfileComponent,
  ]
})
export class DashboardModule { }