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
      'firstName': [''],
      'lastName': [''],
      'address1': [''],
      'address2': [''],
      'city': [''],
      'state': [''],
      'country': [''],
      'company': [''],
      'licenseId': [''],
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
      .then(_ => {
        this.error = '';
      })
      .catch(err => {
        console.log(err);
        this.error = err;
      });
  }

  submitDetails(user) {
    const changedValues = {};
    const formData = this.detailForm.value;
    // only include values that were filled in on the form
    Object.getOwnPropertyNames(formData).forEach(prop => {
      if (formData[prop] !== '' && formData[prop] !== null && formData[prop] !== undefined) {
        changedValues[prop] = formData[prop];
      }
    });
    return this.auth.updateUserData(user, changedValues)
      .catch(err => {
        console.log(err);
        this.error = err;
      });
  }
}
