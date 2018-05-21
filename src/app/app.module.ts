import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { AccountModule } from './account/account.module';
import { CheckoutModule } from './checkout/checkout.module';
import { DesignerModule } from './designer/designer.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DesignerdevComponent } from './designerdev/designerdev.component';
import { DesignerViewComponent } from './designer-view/designer-view.component';
import { SidebarTabComponent } from './designer-view/sidebar-tab/sidebar-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    DesignerdevComponent,
    DesignerViewComponent,
    SidebarTabComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    SharedModule,
    DashboardModule,
    AccountModule,
    CheckoutModule,
    DesignerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }