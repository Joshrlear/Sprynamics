import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '#core/firestore.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-load-template-dialog',
  templateUrl: './load-template-dialog.component.html',
  styleUrls: ['./load-template-dialog.component.scss']
})
export class LoadTemplateDialogComponent implements OnInit {

  designs: Observable<any[]>

  constructor(private firestore: FirestoreService, private dialogRef: MatDialogRef<LoadTemplateDialogComponent> ) { }

  ngOnInit() {
    this.designs = this.firestore.col$('email-designs')
  }

  submit(html: string) {
    this.dialogRef.close(html)
  }

}
