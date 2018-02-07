import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DesignerAdminComponent } from './designer/admin/designer-admin.component';
import { DesignerClientComponent } from './designer/client/designer-client.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';

import { SignupComponent } from './signup/signup.component';
import { ProductsComponent } from './products/products.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { ProfileComponent } from './dashboard/profile/profile.component';

import { AuthGuard } from './core/auth.guard';
import { CartComponent } from './cart/cart.component';
import { TextComponent } from './designer/sidebar/text/text.component';
import { PhotosComponent } from './designer/sidebar/photos/photos.component';
import { ColorsComponent } from './designer/sidebar/colors/colors.component';
import { ContactInfoComponent } from './designer/sidebar/contact-info/contact-info.component';
import { DesignsComponent } from './designer/sidebar/designs/designs.component';
import { AgentsComponent } from './dashboard/agents/agents.component';
import { OrdersComponent } from './dashboard/orders/orders.component';
import { ListsComponent } from './dashboard/lists/lists.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  {
    path: 'designer', component: DesignerClientComponent,
    children: [
      { path: '', redirectTo: 'designs', pathMatch: 'full' },
      { path: 'designs', component: DesignsComponent },
      { path: 'text', component: TextComponent },
      { path: 'photos', component: PhotosComponent },
      { path: 'colors', component: ColorsComponent },
      { path: 'contact', component: ContactInfoComponent },
    ]
  },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin-designer', component: DesignerAdminComponent },
  {
    path: 'profile', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'agents', component: AgentsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'lists', component: ListsComponent }
    ]
  },
  {
    path: 'account', component: AccountComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
