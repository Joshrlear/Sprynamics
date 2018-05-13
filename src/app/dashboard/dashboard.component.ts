import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../core/storage.service';
import { FirestoreService } from '../core/firestore.service';
import { Observable } from 'rxjs';
import { BrandColors } from '#app/shared/colors/brand-colors.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  isSideNavDash = true;
  editing = false;
  error: string;

  userForm: FormGroup;

  templates: Observable<any[]>;

  constructor(public fb: FormBuilder, public auth: AuthService, private storage: StorageService, private firestore: FirestoreService) { }

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
      'licenseId': ['']
    });

    this.auth.user.take(1).subscribe(user => {
      if (user.admin) {
        this.templates = this.firestore.col$('templates');
      }
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

  uploadAvatar(user, file: File) {
    const extension = file.name.split('.').pop();
    const path = `avatars/${user.uid}.${extension}`;
    this.storage.putFile(file, path).then().then(_ => {
      this.storage.getDownloadURL(path).subscribe(url => {
        this.auth.updateUserData(user, { avatarUrl: url });
      });
    });
  }

  uploadCompany(user, file: File) {
    const extension = file.name.split('.').pop();
    const path = `companyLogos/${user.uid}.${extension}`;
    this.storage.putFile(file, path).then().then(_ => {
      this.storage.getDownloadURL(path).subscribe(url => {
        this.auth.updateUserData(user, { companyLogoUrl: url });
      });
    });
  }

  uploadBrokerage(user, file: File) {
    const extension = file.name.split('.').pop();
    const path = `brokerageLogos/${user.uid}.${extension}`;
    this.storage.putFile(file, path).then().then(_ => {
      this.storage.getDownloadURL(path).subscribe(url => {
        this.auth.updateUserData(user, { brokerageLogoUrl: url });
      });
    });
  }

  addTemplate(name: string) {
    this.firestore.add('templates', { name });
  }

}
