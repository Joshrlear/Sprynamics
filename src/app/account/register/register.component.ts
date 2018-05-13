import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { PasswordMatchValidation } from './password-match-validation.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;

  error: string;
  failedSubmit: boolean;

  constructor( public fb: FormBuilder, public auth: AuthService, private router: Router ) { }

  ngOnInit() {
    this.error = '';

    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]],
      'confirmPassword': ['', [
        Validators.required
      ]],
      'recaptcha': ['', [
        // Validators.required
      ]]
    }, {
      validator: PasswordMatchValidation.MatchPassword // validates that confirmPassword === password
    });
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get recaptcha() { return this.signupForm.get('recaptcha'); }

  submitSignup() {
    console.log('submit')
    if (this.signupForm.invalid) {
      console.log('invalid form')
      this.failedSubmit = true;
    } else {
      this.auth.emailSignUp(this.email.value, this.password.value)
        .then(_ => {
          this.router.navigate(['/profile']);
        })
        .catch(err => {
          console.log(err);
          this.error = err;
        });
    }
  }

  captchaResolved(response: string) {

  }

  googleLogin() {
    this.auth.googleLogin()
      .then(login => {
        this.router.navigate(['/profile']);
      }).catch(error => {
        window.alert(error);
        console.log(error);
        this.error = error;
      });
  }

  facebookLogin() {
    this.auth.facebookLogin()
      .then(login => {
        this.router.navigate(['/profile']);
      }).catch(error => {
        window.alert(error);
        console.log(error);
        this.error = error;
      });
  }

}
