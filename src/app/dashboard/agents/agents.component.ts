import { AddAgentDialog } from '#app/dashboard/agents/add-agent-dialog/add-agent.dialog'
import { ImportAgentsDialog } from '#app/dashboard/agents/import-agents-dialog/import-agents.dialog'
import { AuthService } from '#core/auth.service'
import { FirestoreService } from '#core/firestore.service'
import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  uid: string

  agents: any[]

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.user.take(1).subscribe(user => {
      this.uid = user.uid
      const managedAgents = this.firestore.colWithIds$('users', ref =>
        ref.where(`managers.${user.uid}`, '==', true)
      )
      managedAgents.subscribe(agents => {
        this.agents = agents
      })
    })
  }

  addAgent() {
    const dialogRef = this.dialog.open(AddAgentDialog)
  }

  createAgent() {
    const doc = this.firestore.col('users').ref.doc()
    const agent = {
      id: doc.id,
      uid: doc.id,
      isCreated: true,
      managerId: this.uid,
      managers: { [this.uid]: true }
    }
    this.firestore.set(`users/${doc.id}`, agent).then(ref => {
      this.viewAgent(agent)
    })
  }

  viewAgent(agent) {
    let path
    this.router.navigate([`/profile/agents/${agent.id}`], {
      queryParams: { isCreated: agent.isCreated }
    })
  }

  deleteAgent(agent) {
    if (
      window.confirm(
        'Are you sure you want to remove your access to this agent?'
      )
    ) {
      this.firestore
        .doc$(`users/${agent.uid}`)
        .take(1)
        .subscribe((agent: any) => {
          agent.managers[this.uid] = false
          this.firestore.update(`users/${agent.uid}`, agent)
        })
    }
    window.alert('Successfully removed agent.')
  }

  uploadFile(file: File) {
    const dialogRef = this.dialog.open(ImportAgentsDialog, {
      width: '500px',
      data: { file }
    })
  }
}
