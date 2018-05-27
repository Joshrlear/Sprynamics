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
import { TermsAndConditionsComponent } from './legal/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
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