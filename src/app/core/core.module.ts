import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';

// angularfire2
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
// misc packages
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { RecaptchaModule } from 'ng-recaptcha';
// services
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { FirestoreService } from './firestore.service';
import { NavigationService } from './navigation/navigation.service';
import { CheckoutService } from '#app/checkout/checkout.service';
import { HttpClientModule } from '@angular/common/http';
import { MlsService } from '#core/mls.service';
import { GoogleMapsService } from '#core/gmaps.service';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  imports: [
    // angularfire2
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    // misc packages
    NgbModule.forRoot(),
    // RecaptchaModule.forRoot(),
    HttpClientModule,
    ContextMenuModule.forRoot()
  ],
  providers: [
    AuthService,
    StorageService,
    FirestoreService,
    NavigationService,
    CheckoutService,
    MlsService,
    GoogleMapsService,
  ]
})
export class CoreModule { }
