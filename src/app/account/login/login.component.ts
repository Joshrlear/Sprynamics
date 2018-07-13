import {Component, OnInit} from '@angular/core'
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router, ActivatedRoute} from '@angular/router'

import {AuthService} from '../../core/auth.service'
import {AngularFireAuth} from 'angularfire2/auth'
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  error: string

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private afAuth: AngularFireAuth,
              private http: HttpClient) {}

  ngOnInit() {
    this.error = ''

    this.route.queryParams.take(1).subscribe(async queryParams => {
      console.log(queryParams)
      const linkedInAuthCode = queryParams.code
      const linkedInError = queryParams.error
      if (linkedInError) {
        const errorMessage = queryParams.error_description
        window.alert(errorMessage)
        return
      }
      if (linkedInAuthCode) {
        console.log(linkedInAuthCode);
        try {
           this.http.get('https://us-central1-sprynamics.cloudfunctions.net/token?code=' + linkedInAuthCode)
            .subscribe((res: any) => {
              console.log(res)
              if (res.token) {
                this.afAuth.auth.signInWithCustomToken(res.token)
                  .then((arg) => {
                    console.log(arg)
                      this.auth.linkedinLogin(arg).then(() => {
                        this.router.navigate(['/profile']);
                      })
                  })
                  .catch(err => {
                    console.error(err)
                  })
              } else {
                console.error(res);
                window.alert("Error in the token Function:" + res.error)
              }
            });
        } catch (err) {
          console.error(err)
          window.alert(err.message)
        }
      }
    })

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.maxLength(25)]]
    })
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  async submitLogin() {
    try {
      await this.auth.emailLogin(this.loginForm.value.email, this.loginForm.value.password)
      this.router.navigate(['/profile'])
    } catch (error) {
      window.alert(error)
      console.log(error)
      this.error = error
    }
  }

  linkedinLogin() {
    window.location.replace('https://us-central1-sprynamics.cloudfunctions.net/redirect')
  }

  async googleLogin() {
    try {
      await this.auth.googleLogin()
      this.router.navigate(['/profile'])
    } catch (error) {
      window.alert(error)
      console.log(error)
      this.error = error
    }
  }

  async facebookLogin() {
    try {
      await this.auth.facebookLogin()
      this.router.navigate(['/profile'])
    } catch (error) {
      window.alert(error)
      console.log(error)
      this.error = error
    }
  }
}
