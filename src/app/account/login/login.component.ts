import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  error: string;

  constructor( public fb: FormBuilder, public auth: AuthService, private router: Router ) { }

  ngOnInit() {
    this.error = '';

    this.loginForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  submitLogin() {
    this.auth.emailLogin(this.loginForm.value.email, this.loginForm.value.password)
      .then(login => {
        this.router.navigate(['/profile']);
      }).catch(error => {
        console.log(error);
        this.error = error;
      });
  }

}
