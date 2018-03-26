import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '#core/firestore.service';
import { AuthService } from '#core/auth.service';
import { Http } from '@angular/http';
import * as dropin from 'braintree-web-drop-in';

@Component({
  selector: 'app-view-agent',
  templateUrl: './view-agent.component.html',
  styleUrls: ['./view-agent.component.scss']
})
export class ViewAgentComponent implements OnInit {

  agent: Observable<any>;
  braintreeId;
  agentId;
  token;
  instance;

  loading: boolean;

  constructor(private route: ActivatedRoute,
    private firestore: FirestoreService,
    private auth: AuthService,
    private http: Http) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.agentId = params.agentId;
      this.route.queryParams.subscribe(queryParams => {
        this.agent = this.firestore.doc$(`users/${params.agentId}`)
          .map((agent: any) => { agent.id = params.agentId; this.braintreeId = agent.braintreeId; return agent });
        this.loadPaymentMethods(params.agentId);
      });
    });
  }

  loadPaymentMethods(id) {
    this.agent.take(1).subscribe(agent => {
      if (agent.braintreeId) {
        this.getClientToken(agent.braintreeId);
      } else {
        // init braintree customer for this user
        const data = {
          firstName: agent.firstName || '',
          lastName: agent.lastName || '',
          email: agent.email || '',
        }
        this.http.post('https://us-central1-sprynamics.cloudfunctions.net/customer', data)
          .take(1).subscribe((res: any) => {
            const id = JSON.parse(res._body).customerId;
            this.braintreeId = id;
            this.firestore.update(`users/${agent.uid}`, { braintreeId: id });
            this.getClientToken(id);
          });
      }
    });
  }

  getClientToken(braintreeId) {
    console.log('getClientToken');
    this.token = this.http.post('https://us-central1-sprynamics.cloudfunctions.net/getClientToken',
      { customerId: braintreeId })
      .map((res: any) => JSON.parse(res._body).token)
      .take(1).subscribe(token => {
        this.token = token;
        this.loading = false;
        this.createDropin(token);

      });
  }

  createDropin(token) {
    dropin.create({
      container: '#dropin',
      authorization: token,
      paypal: {
        flow: 'vault'
      },
      venmo: true,
      applePay: {

      },
      googlePay: {

      }
    }, (err, instance) => {
      this.instance = instance;
    });
  }

  tabChange(tab) {
    if (tab.nextId === 'tab-payment') {
      this.loading = true;
      if (this.braintreeId) {
        this.getClientToken(this.braintreeId);
      } else {
        this.loadPaymentMethods(this.agentId);
      }
    }
  }

  clickButton() {
    this.instance.requestPaymentMethod((err, payload) => {
      if (err) {
        window.alert(err.message);
      } else {
      }
    });
  }

}
