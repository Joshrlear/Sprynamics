import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '#core/firestore.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';
import { AuthService } from '#core/auth.service';
import { MatDialog } from '@angular/material';
import { AddAgentDialogComponent } from '#app/dashboard/agents/add-agent-dialog/add-agent-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  uid: string;

  agents: any[];

  constructor(private firestore: FirestoreService,
    private auth: AuthService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe(user => {
      this.uid = user.uid;
      const managedAgents = this.firestore.colWithIds$('users', ref => ref.where(`managers.${user.uid}`, '==', true));
      const createdAgents = this.firestore.colWithIds$(`users/${user.uid}/agents`);
      managedAgents.subscribe(agents1 => {
        createdAgents.subscribe(agents2 => {
          this.agents = agents1.concat(agents2);
        });
      });
    });
  }

  addAgent() {
    const dialogRef = this.dialog.open(AddAgentDialogComponent);
  }

  createAgent() {
    this.firestore.add(`users/${this.uid}/agents`, {isCreated: true, managerId: this.uid}).then(ref => {
      this.viewAgent({id: ref.id, isCreated: true, managerId: this.uid});
    });
  }

  viewAgent(agent) {
    let path;
    this.router.navigate([`/profile/agents/${agent.id}`], { queryParams: { isCreated: agent.isCreated }});
  }
  
  deleteAgent(agent) {
    if (agent.isCreated) {
      if (window.confirm('Are you sure you want to delete this agent?')) {
        this.firestore.delete(`users/${this.uid}/agents/${agent.id}`);
      }
    } else {
      if (window.confirm('Are you sure you want to remove your access to this agent?')) {
        this.firestore.doc$(`users/${agent.uid}`).take(1).subscribe((agent: any) => {
          agent.managers[this.uid] = false;
          this.firestore.update(`users/${agent.uid}`, agent);
        });
      }
    }
    window.alert('Successfully removed agent.');
  }

}
