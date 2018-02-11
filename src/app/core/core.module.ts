import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';

// angularfire2
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
// ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// ng-recaptcha
import { RecaptchaModule } from 'ng-recaptcha';
// services
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { FirestoreService } from './firestore.service';
import { NavigationService } from './navigation/navigation.service';
import { CheckoutService } from '#app/checkout/checkout.service';

@NgModule({
  imports: [
    // angularfire2
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    // ng-bootstrap
    NgbModule.forRoot(),
    // ng-recaptcha
    RecaptchaModule.forRoot(),
  ],
  providers: [
    AuthService, 
    StorageService, 
    FirestoreService,
    NavigationService,
    CheckoutService
  ]
})
export class CoreModule { }
