import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  editing = false;
  error: string;

  userForm: FormGroup;

  constructor(public fb: FormBuilder, public auth: AuthService) { }

  ngOnInit() {
    this.error = '';

    this.userForm = this.fb.group({
      'email': [''],
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

  edit() {
    this.editing = true;
  }

  save(user) {
    const changedValues = {};
    const formData = this.userForm.value;
    // only include values that were filled in on the form
    Object.getOwnPropertyNames(formData).forEach(prop => {
      if (formData[prop] !== '' && formData[prop] !== null && formData[prop] !== undefined) {
        changedValues[prop] = formData[prop];
      }
    });
    return this.auth.updateUserData(user, changedValues)
      .then(_ => {
        this.editing = false;
      })
      .catch(err => {
        console.log(err);
        this.error = err;
      });
  }

}