import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as firebase from 'firebase/app';
import { FirestoreService } from '#core/firestore.service';
import { AuthService } from '#core/auth.service';

@Component({
  selector: 'app-view-list-dialog',
  templateUrl: './view-list-dialog.component.html',
  styleUrls: ['./view-list-dialog.component.scss']
})
export class ViewListDialogComponent implements OnInit {

  list: any;
  rows: any;

  isLoading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<ViewListDialogComponent>,
    private firestore: FirestoreService,
    private auth: AuthService) { }

  ngOnInit() {
    this.list = this.data.list;
    this.isLoading = true;
    this.auth.user.take(1).subscribe(currentUser => {
      let addressesPath: string;
      this.rows = this.firestore.colWithIds$(`lists/${this.list.id}/addresses`);
      this.rows.take(1).subscribe(_ => this.isLoading = false);
    })
  }

  deleteRow(rowId) {
    this.firestore.doc(`lists/${this.list.id}/addresses/${rowId}`).delete();
  }

  deleteList() {
    if (window.confirm('Are you sure you want to permanently delete this list?')) {
      firebase.firestore().doc(`lists/${this.list.id}`).delete();
      this.dialogRef.close();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
