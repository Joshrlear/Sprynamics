import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../core/firestore.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/user.interface';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userRef: Observable<User>;
  user: any;
  userSub: Subscription;

  userForm: FormGroup

  constructor(private auth: AuthService, private firestore: FirestoreService, private fb: FormBuilder) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      this.user = user;
    });

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
  }

  ngOnDestroy() {
    this.userSub.unsubscribe
  }

  addColor() {
    this.firestore.update(this.user.uid, {  })
  }



}
