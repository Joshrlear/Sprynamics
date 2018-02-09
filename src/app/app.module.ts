import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { LoginComponent as OtherLoginComponent } from './account/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { DesignerAdminComponent } from './designer/admin/designer-admin.component';
import { DesignerClientComponent } from './designer/client/designer-client.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProductsComponent } from './products/products.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';

import { ButtonsModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from './navigation.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { DesignComponent } from './dashboard/design/design.component';
import { AccountComponent } from './account/account.component';
import { RegisterComponent } from './account/register/register.component';
import { ObjectFactoryService } from './designer/object-factory.service';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { TextComponent } from './designer/sidebar/text/text.component';
import { PhotosComponent } from './designer/sidebar/photos/photos.component';
import { ColorsComponent } from './designer/sidebar/colors/colors.component';
import { ContactInfoComponent } from './designer/sidebar/contact-info/contact-info.component';
import { DesignsComponent } from './designer/sidebar/designs/designs.component';
import { ScrollService } from './core/scroll.service';
import { AgentsComponent } from './dashboard/agents/agents.component';
import { OrdersComponent } from './dashboard/orders/orders.component';
import { ListsComponent } from './dashboard/lists/lists.component';
import { CropDialogComponent } from './designer/crop-dialog/crop-dialog.component';
<<<<<<< HEAD
import { AlignmentService } from '#app/designer/admin/alignment.service';
import { SidebarComponent } from './designer/sidebar/sidebar.component';
=======
import { ShippingComponent } from './checkout/shipping/shipping.component';
import { PaymentComponent } from './checkout/payment/payment.component';
import { ConfirmComponent } from './checkout/confirm/confirm.component';
import { OrderSummaryComponent } from './checkout/order-summary/order-summary.component';
>>>>>>> 09d01634959868bfe1c6fbac2fce53ce6bc6e4d6

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    OtherLoginComponent,
    DashboardComponent,
    HomeComponent,
    DesignerAdminComponent,
    DesignerClientComponent,
    NavigationComponent,
    ProductsComponent,
    CheckoutComponent,
    CartComponent,
    SidenavComponent,
    ProfileComponent,
    DesignComponent,
    AccountComponent,
    BreadcrumbsComponent,
    TextComponent,
    PhotosComponent,
    ColorsComponent,
    ContactInfoComponent,
    DesignsComponent,
    RegisterComponent,
    AgentsComponent,
    OrdersComponent,
    ListsComponent,
    CropDialogComponent,
    SidebarComponent,
    ShippingComponent,
    PaymentComponent,
    ConfirmComponent,
    OrderSummaryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    AppRoutingModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    ColorPickerModule,
    HttpModule,
    CommonModule
  ],
  entryComponents: [ 
    CropDialogComponent
  ],
  providers: [NavigationService, ObjectFactoryService, ScrollService, AlignmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
