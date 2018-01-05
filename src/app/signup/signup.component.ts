import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  detailForm: FormGroup;

  error: string;

  constructor(public fb: FormBuilder, public auth: AuthService) { }

  ngOnInit() {
    this.error = '';

    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });

    this.detailForm = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'address1': ['', [Validators.required]],
      'address2': ['', []],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'country': ['', [Validators.required]],
      'company': ['', [Validators.required]],
      'licenseId': ['', [Validators.required]],
    });
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

  get firstName() { return this.detailForm.get('firstName'); }
  get lastName() { return this.detailForm.get('lastName'); }
  get address1() { return this.detailForm.get('address1'); }
  get address2() { return this.detailForm.get('address2'); }
  get city() { return this.detailForm.get('city'); }
  get state() { return this.detailForm.get('state'); }
  get country() { return this.detailForm.get('country'); }
  get company() { return this.detailForm.get('company'); }
  get licenseId() { return this.detailForm.get('licenseId'); }

  submitSignup() {
    return this.auth.emailSignUp(this.email.value, this.password.value)
      .catch(err => {
        console.log(err);
        this.error = err;
      });
  }

  submitDetails(user) {
    return this.auth.updateUserData(user, this.detailForm.value)
      .catch(err => {
        console.log(err);
        this.error = err;
      });
  }
}
