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

import { NgxsModule } from '@ngxs/store'
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin'
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin'

import { AppState } from './state/app.state';
import { ProcessingWindowComponent } from './processing-window/processing-window.component'

@NgModule({
  declarations: [AppComponent, TermsAndConditionsComponent, PrivacyPolicyComponent, SidenavComponent, ProcessingWindowComponent],
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
