import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'

import { CoreModule } from './core/core.module'
import { AppRoutingModule } from './app-routing.module'
import { SharedModule } from './shared/shared.module'

import { DashboardModule } from './dashboard/dashboard.module'
import { AccountModule } from './account/account.module'
import { CheckoutModule } from './checkout/checkout.module'
import { DesignerModule } from './designer/designer.module'

import { AppComponent } from './app.component'
import { TermsAndConditionsComponent } from './legal/terms-and-conditions/terms-and-conditions.component'
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component'
import { SidenavComponent } from '#app/sidenav/sidenav.component'
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, TermsAndConditionsComponent, PrivacyPolicyComponent, SidenavComponent],
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
    HttpClientModule
    // NgxsModule.forRoot([
    //   RouterState,
    //   AppState
    // ]),
    // NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
