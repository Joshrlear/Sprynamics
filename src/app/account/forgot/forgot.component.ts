import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '#core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  emailForm: FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  submit() {
    const email = this.emailForm.value.email;
    this.auth.sendPasswordResetEmail(email)
      .then(_ => {
        window.alert('Your password reset instructions will be sent to your email. It should arrive shortly.');
        this.router.navigate(['/account/login']);
      })
      .catch(err => {
        console.log(err.message);
        window.alert(err.message);
      });
  }

}
