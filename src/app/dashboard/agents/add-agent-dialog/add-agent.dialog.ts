import { Component, OnInit } from '@angular/core'
import { FirestoreService } from '#core/firestore.service'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-add-agent-dialog',
  templateUrl: './add-agent.dialog.html',
  styleUrls: ['./add-agent.dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AddAgentDialog implements OnInit {
  email: string
  error: boolean

  constructor(
    public dialogRef: MatDialogRef<AddAgentDialog>,
    private firestore: FirestoreService
  ) {}

  ngOnInit() {}

  async submit() {
    const results = await this.firestore.promiseCol('agents', ref =>
      ref.where('email', '==', this.email)
    )
    if (results.length === 0) {
      this.error = true
    } else {
      this.dialogRef.close(results[0])
    }
  }

  resetError() {
    this.error = false
  }
}
