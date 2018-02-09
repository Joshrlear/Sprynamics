import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../core/firestore.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/user.interface';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userRef: Observable<User>;
  user: any;
  userSub: Subscription;

  userForm: FormGroup;

  constructor(private auth: AuthService, private firestore: FirestoreService, private fb: FormBuilder) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      this.user = user;

      this.userForm = this.fb.group({
        'email': [user.email, Validators.email],
        'firstName': [user.firstName],
        'lastName': [user.lastName],
        'address1': [user.address1],
        'address2': [user.address2],
        'city': [user.city],
        'state': [user.state],
        'zipCode': [user.zipCode],
        'country': [user.country],
        'company': [user.company],
        'licenseId': [user.licenseId]
      });
    });

  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  saveForm() {
    console.log(this.userForm.value);
    this.firestore.update(`users/${this.user.uid}`, this.userForm.value);
    window.alert('Your changes have been saved.');
  }

  addColor() {
    if (!this.user.brandColors) { this.user.brandColors = []; }
    this.user.brandColors.push('#ffffffff');
    this.saveColors();
  }

  setColor(event) {
    this.user.brandColors[event.index] = event.color;
  }

  saveColors() {
    this.firestore.update(`users/${this.user.uid}`, { brandColors: this.user.brandColors });
  }


}
