import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { DesignerAdminComponent } from './designer/admin/designer-admin.component';
import { DesignerClientComponent } from './designer/client/designer-client.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProductsComponent } from './products/products.component';
import { LoadTemplateDialogComponent } from './designer/load-template-dialog/load-template-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    DesignerAdminComponent,
    DesignerClientComponent,
    NavigationComponent,
    ProductsComponent,
    LoadTemplateDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    AppRoutingModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    ColorPickerModule,
    HttpModule,
  ],
  entryComponents: [
    LoadTemplateDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
