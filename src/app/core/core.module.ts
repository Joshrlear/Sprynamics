import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { FirestoreService } from './firestore.service';

import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    MaterialModule,
  ],
  exports: [
    MaterialModule
  ],
  providers: [AuthService, StorageService, FirestoreService]
})
export class CoreModule { }
