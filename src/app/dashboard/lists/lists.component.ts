import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MailingListDialogComponent } from '#shared/mailing-list-dialog/mailing-list-dialog.component';
import { ViewListDialogComponent } from '#shared/view-list-dialog/view-list-dialog.component';
import { Observable } from 'rxjs';
import { FirestoreService } from '#core/firestore.service';
import { AuthService } from '#core/auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  lists: Observable<any[]>;

  @Input('agent') agent: any;

  constructor(
    private dialog: MatDialog,
    private firestore: FirestoreService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.auth.user.take(1).subscribe(user => {
      this.firestore.colWithIds$('users', ref => ref.where(`managers.${user.uid}`, '==', true))
        .take(1).subscribe(agents => {
          const userLists$ = this.firestore.colWithIds$('lists', ref => ref.where('uid', '==', user.uid).orderBy('createdAt', 'desc'))
            .map((lists: any) => { lists.forEach(list => list.agent = 'Me'); return lists });
          const listObservables = [userLists$];
          agents.forEach(agent => {
            const agentLists$ = this.firestore.colWithIds$('lists', ref => ref.where('uid', '==', agent.uid).orderBy('createdAt', 'desc'))
              .map((lists: any) => { lists.forEach(list => list.agent = agent.firstName + ' ' + agent.lastName); return lists });
            listObservables.push(agentLists$);
          });
          this.lists = this.firestore.combine(listObservables);
        });
    });
  }

  uploadFile(file: File) {
    const dialogRef = this.dialog.open(MailingListDialogComponent, {
      width: '500px',
      data: { file, agent: this.agent }
    });
  }

  viewList(list) {
    const dialogRef = this.dialog.open(ViewListDialogComponent, {
      data: { list, agent: this.agent }
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
