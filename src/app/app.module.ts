import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule } from "@angular/core"

import { CoreModule } from "./core/core.module"
import { AppRoutingModule } from "./app-routing.module"
import { SharedModule } from "./shared/shared.module"

import { AppComponent } from "./app.component"
import { TermsAndConditionsComponent } from "./legal/terms-and-conditions/terms-and-conditions.component"
import { PrivacyPolicyComponent } from "./legal/privacy-policy/privacy-policy.component"
import { SidenavComponent } from "#app/sidenav/sidenav.component"
import { HttpClientModule } from "@angular/common/http"
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsModule } from "@ngxs/store";
import { AppState } from '#app/checkout/app.state';

@NgModule({
  declarations: [AppComponent, TermsAndConditionsComponent, PrivacyPolicyComponent, SidenavComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HttpClientModule,
    NgxsModule.forRoot([
      AppState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
