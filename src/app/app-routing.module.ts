import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { DesignerAdminComponent } from './designer/admin/designer-admin.component';
import { DesignerClientComponent } from './designer/client/designer-client.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'designer', component: DesignerClientComponent },
  { path: 'admin-designer', component: DesignerAdminComponent },
  {
    path: 'account', 
    component: AccountComponent,
    loadChildren: 'app/account/account.module#AccountModule',
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    loadChildren: 'app/checkout/checkout.module#CheckoutModule',
  },
  {
    path: 'profile',
    component: DashboardComponent,
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
