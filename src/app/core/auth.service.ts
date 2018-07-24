import { FirestoreService } from '#core/firestore.service'
import { DEFAULT_BRAND_COLORS } from '#models/brand-colors.model'
import { User } from '#models/user.model'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFirestore } from 'angularfire2/firestore'
import * as firebase from 'firebase/app'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import {StorageService} from '#core/storage.service';
import { Store, Select } from '@ngxs/store';
import { SetUser } from '#app/checkout/app.actions';

@Injectable()
export class AuthService {
  authState: Observable<firebase.User>
  _user: Observable<User>
  @Select(state => state.app.user) user;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private firestore: FirestoreService,
    private storage: StorageService,
    private router: Router,
    private store: Store
  ) {

    // Get auth data, then get firestore user document || null
    this.authState = this.afAuth.authState
    this._user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )
    this._user.subscribe((user) => {
      if (user) {
        this.store.dispatch(new SetUser(user));
      }
    });
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(auth => {
        console.log(auth)
        return this.emailLogin(email, password).then(_ => {
          return this.afs.doc(`users/${auth.user.uid}`).set({
            uid: auth.user.uid,
            email,
            brandColors: DEFAULT_BRAND_COLORS
          })
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  emailLogin(username: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(username, password)
  }

  async linkedinLogin(credential) {
    await this.updateUserData(credential.user, {
      uid: credential.user.uid,
      email: credential.user.email,
      firstName: credential.user.displayName.split(' ')[0],
      lastName: credential.user.displayName.split(' ')[1] || '',
      brandColors: DEFAULT_BRAND_COLORS,
      avatarUrl: credential.user.photoURL
    })
  }

  async googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    try {
      const credential = await this.afAuth.auth.signInWithPopup(provider)
      await this.updateUserData(credential.user, {
        uid: credential.user.uid,
        email: credential.user.email,
        firstName: credential.user.displayName.split(' ')[0],
        lastName: credential.user.displayName.split(' ')[1] || '',
        brandColors: DEFAULT_BRAND_COLORS
      })
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.email
        const methods = await this.afAuth.auth.fetchSignInMethodsForEmail(email)
        console.log(methods)
        if (methods.includes(firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)) {
          throw new Error(
            'An account already exists for the email associated with this Google account. Please log in with your email and password.'
          )
        } else if (methods.includes(firebase.auth.FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD)) {
          this.facebookLogin()
        }
      }
    }
  }

  async facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    provider.setCustomParameters({
      auth_type: 'reauthenticate'
    })
    try {
      const credential = await this.afAuth.auth.signInWithPopup(provider)
      await this.updateUserData(credential.user, {
        uid: credential.user.uid,
        email: credential.user.email,
        firstName: credential.user.displayName.split(' ')[0],
        lastName: credential.user.displayName.split(' ')[1] || '',
        brandColors: DEFAULT_BRAND_COLORS
      })
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.email
        const methods = await this.afAuth.auth.fetchSignInMethodsForEmail(email)
        console.log(methods)
        if (methods.includes(firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)) {
          throw new Error(
            'An account already exists for the email associated with this Facebook account. Please log in with your email and password.'
          )
        } else if (methods.includes(firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD)) {
          this.googleLogin()
        }
      }
    }
  }

  anonLogin() {
    return this.afAuth.auth.signInAnonymously()
  }

  // update properties on user document
  updateUserData(user: User, data: Partial<User>) {
    return this.firestore.initialSetUser<User>(`users/${user.uid}`, data)
  }

  logout() {
    this.afAuth.auth.signOut()
  }

  sendPasswordResetEmail(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
  }
}
