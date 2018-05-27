import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PapaParseService } from 'ngx-papaparse';
import { FirestoreService } from '#core/firestore.service';
import { AuthService } from '#core/auth.service';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-mailing-list.dialog',
  templateUrl: './mailing-list.dialog.html',
  styleUrls: ['./mailing-list.dialog.scss']
})
export class MailingListDialog implements OnInit {

  isLoading: boolean;

  title: string;

  csvData: any[];
  columns = ['Owner Name', 'Mailing Address', 'Mailing City', 'Mailing State', 'Mailing Zip Code'];
  mappedColumns = []; // this will end up being an array of column numbers corresponding to the above names

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MailingListDialog>,
    private papa: PapaParseService,
    private firestore: FirestoreService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.papa.parse(event.target.result, {
        skipEmptyLines: true,
        complete: (results, file) => {
          this.csvData = results.data;
          this.isLoading = false;
        }
      })
    };
    reader.readAsText(this.data.file);
  }

  // maps a column to a mailing list value
  setColumn(index: number, val: string) {
    const col = parseInt(val);
    this.mappedColumns[index] = col;
  }

  saveList() {
    this.isLoading = true;

    const results = [];
    const rowCount = this.csvData.length;
    this.csvData.forEach((row, i) => {
      if (i === 0) return; // skip first row (column headers)
      const obj = {};
      this.columns.forEach((col, j) => {
        let item = row[this.mappedColumns[j]];
        if (item === undefined)
          item = '';
        obj[col] = item;
      });
      results.push(obj);
    });

    this.auth.user.take(1).subscribe(currentUser => {
      const user = this.data.agent || currentUser;
      this.firestore.add('lists', {
        uid: user.uid || user.id,
        title: this.title,
        rowCount: rowCount,
        usage: 0
      })
        .then(ref => {
          const batch = firebase.firestore().batch();
          results.forEach(addressData => {
            const addressRef = firebase.firestore().collection(`lists/${ref.id}/addresses`).doc();
            batch.set(addressRef, addressData);
          });
          batch.commit()
            .then(success => {
              this.isLoading = false
              this.dialogRef.close(ref.id);
            })
            .catch(err => {
              window.alert(err.message);
              console.log(err.message);
            });
        })
        .catch(err => {
          window.alert(err.message);
          console.log(err.message);
        })
    })
  }

}
