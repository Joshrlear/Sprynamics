import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DesignerAdminComponent } from './designer/admin/designer-admin.component';
import { DesignerClientComponent } from './designer/client/designer-client.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { AuthGuard } from './core/auth.guard';
import { DesignerModule } from '#app/designer/designer.module';
import { TermsAndConditionsComponent } from '#app/legal/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from '#app/legal/privacy-policy/privacy-policy.component';
import { LoginComponent } from '#app/account/login/login.component';
import { AccountModule } from '#app/account/account.module';
import { CheckoutModule } from '#app/checkout/checkout.module';
import { DashboardModule } from '#app/dashboard/dashboard.module';

const routes: Routes = [
  { path: '', component: DashboardComponent, loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
  { path: 'designer', loadChildren: './designer/designer.module#DesignerModule' },
  { path: 'terms', component: TermsAndConditionsComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  {
    path: 'account', 
    component: AccountComponent,
    loadChildren: './account/account.module#AccountModule',
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
