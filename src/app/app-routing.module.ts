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
import { DesignerModule } from '#app/designer/designer.module';
import { TermsAndConditionsComponent } from '#app/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from '#app/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'designer', loadChildren: () => DesignerModule },
  { path: 'terms', component: TermsAndConditionsComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  {
    path: 'account', 
    component: AccountComponent,
    loadChildren: './account/account.module#AccountModule',
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    loadChildren: './checkout/checkout.module#CheckoutModule',
  },
  {
    path: 'profile',
    component: DashboardComponent,
    loadChildren: './dashboard/dashboard.module#DashboardModule',
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
