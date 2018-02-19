import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MailingListDialogComponent } from '#shared/mailing-list-dialog/mailing-list-dialog.component';
import { ViewListDialogComponent } from '#shared/view-list-dialog/view-list-dialog.component';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '#core/firestore.service';
import { AuthService } from '#core/auth.service';
import { PapaParseService } from 'ngx-papaparse';

import * as moment from 'moment';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  lists: Observable<any[]>

  constructor(private dialog: MatDialog,
    private firestore: FirestoreService,
    private auth: AuthService,
    private papa: PapaParseService) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe(user => {
      this.lists = this.firestore.colWithIds$('lists', ref => ref.where('uid', '==', user.uid).orderBy('createdAt', 'desc'));
    });
  }

  uploadFile(file: File) {
    const dialogRef = this.dialog.open(MailingListDialogComponent, {
      width: '500px',
      data: { file }
    });
    dialogRef.afterClosed().take(1).subscribe((result: any) => {
      
    });
  }

  viewList(list) {
    const dialogRef = this.dialog.open(ViewListDialogComponent, {
      data: { list }
    });
  }

  downloadCSV(list) {
    this.firestore.colWithIds$(`lists/${list.id}/addresses`)
      .take(1)
      .subscribe(addresses => {
        const arr = [['Owner Name', 'Mailing Address', 'Mailing City', 'Mailing State', 'Mailing Zip Code']];
        addresses.forEach(addr => {
          arr.push([
            addr['Owner Name'],
            addr['Mailing Address'],
            addr['Mailing City'],
            addr['Mailing State'],
            addr['Mailing Zip Code']
          ]);
        });
        var csvRows = [];
        for (var i = 0; i < arr.length; ++i) {
          for (var j = 0; j < arr[i].length; ++j) {
            arr[i][j] = '\"' + arr[i][j] + '\"';  // Handle elements that contain commas
          }
          csvRows.push(arr[i].join(','));
        }

        var csvString = csvRows.join('\r\n').replace(/ /g, '%20');
        console.log(csvString);
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + csvString;
        a.target = '_blank';
        a.download = `${list.title}.csv`;

        document.body.appendChild(a);
        a.click();
      })
  }

  formatDate(dateString: string) {
    return moment(dateString).format('MMM Do YYYY, [at] h:mm:ss a') + ` (${moment(dateString).fromNow()})`;
  }

}
