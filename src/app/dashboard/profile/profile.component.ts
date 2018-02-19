import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../../core/firestore.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/user.interface';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '#core/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input('agent') agent: any

  userRef: Observable<User>;
  user: any;
  userSub: Subscription;

  userForm: FormGroup;

  constructor(private auth: AuthService,
    private firestore: FirestoreService,
    private storage: StorageService,
    private fb: FormBuilder) { }

  ngOnInit() {
    if (this.agent) {
      let agentPath;
      if (this.agent.isCreated) {
        agentPath = `users/${this.agent.managerId}/agents/${this.agent.id}`;
        console.log(agentPath);
      } else {
        agentPath = `users/${this.agent.uid}`;
      }
      this.userSub = this.firestore.doc$(agentPath).subscribe(user => {
        this.user = user;
        this.buildForm();
        console.log(this.user);
      });
    } else {
      this.userSub = this.auth.user.subscribe(user => {
        this.user = user;
        this.buildForm();
      });
    }
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  buildForm() {
    this.userForm = this.fb.group({
      'email': [this.user.email, Validators.email],
      'firstName': [this.user.firstName],
      'lastName': [this.user.lastName],
      'address1': [this.user.address1],
      'address2': [this.user.address2],
      'city': [this.user.city],
      'state': [this.user.state],
      'zipCode': [this.user.zipCode],
      'country': [this.user.country],
      'company': [this.user.company],
      'licenseId': [this.user.licenseId]
    });
  }

  saveForm() {
    console.log(this.user);
    if (this.user.isCreated) {
      this.firestore.update(`users/${this.user.managerId}/agents/${this.user.id}`, this.userForm.value)
    } else {
      this.firestore.update(`users/${this.user.uid}`, this.userForm.value);
    }
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

  uploadAvatar(file: File) {
    const extension = file.name.split('.').pop();
    const path = `avatars/${this.user.uid}.${extension}`;
    this.storage.putFile(file, path).then().then(_ => {
      this.storage.getDownloadURL(path).subscribe(url => {
        if (this.user.isCreated) {
          this.firestore.update(`users/${this.user.managerId}/agents/${this.agent.id}`, { avatarUrl: url });
        } else {
          this.firestore.update(`users/${this.user.uid}`, { avatarUrl: url });
        }
      });
    });
  }

  uploadCompany(file: File) {
    const extension = file.name.split('.').pop();
    const path = `companyLogos/${this.user.uid}.${extension}`;
    this.storage.putFile(file, path).then().then(_ => {
      this.storage.getDownloadURL(path).subscribe(url => {
        if (this.user.isCreated) {
          console.log(this.user);
          this.firestore.update(`users/${this.user.managerId}/agents/${this.agent.id}`, { avatarUrl: url });
        } else {
          this.firestore.update(`users/${this.user.uid}`, { companyLogoUrl: url });
        }
      });
    });
  }

  uploadBrokerage(file: File) {
    const extension = file.name.split('.').pop();
    const path = `brokerageLogos/${this.user.uid}.${extension}`;
    this.storage.putFile(file, path).then().then(_ => {
      this.storage.getDownloadURL(path).subscribe(url => {
        if (this.user.isCreated) {
          this.firestore.update(`users/${this.user.managerId}/agents/${this.agent.id}`, { avatarUrl: url });
        } else {
          this.firestore.update(`users/${this.user.uid}`, { brokerageLogoUrl: url });
        }
      });
    });
  }


}
