import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'

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
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.error = ''

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
      await this.auth.emailLogin(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
      this.router.navigate(['/profile'])
    } catch (error) {
      window.alert(error)
      console.log(error)
      this.error = error
    }
  }

  linkedinLogin() {
    const popup = window.open(
      'linkedin-popup.html',
      'name',
      'height=585,width-400'
    )
    popup.addEventListener('finishedlinkedinlogin', () => {
      console.log('yuh')
      this.router.navigate(['/profile'])
    })
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
