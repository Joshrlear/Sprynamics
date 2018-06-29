import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthService } from '../../core/auth.service'
import { AngularFireAuth } from 'angularfire2/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  error: string

  constructor(
    public fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth
  ) {}

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
        console.log(linkedInAuthCode)
        const form = new FormData()
        form.append('code', linkedInAuthCode)
        try {
          const linkedInToken = await fetch('https://us-central1-sprynamics.cloudfunctions.net/token', {
            method: 'POST',
            mode: 'no-cors',
            body: form
          })
          console.log(linkedInToken)
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
