import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '#core/firestore.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '#core/auth.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  agents: Observable<any[]>

  constructor(private firestore: FirestoreService,
    private auth: AuthService) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe(user => {
      this.agents = this.firestore.colWithIds$('users', ref => ref.where(`managers.${user.uid}`, '==', true));
    });
  }

}
