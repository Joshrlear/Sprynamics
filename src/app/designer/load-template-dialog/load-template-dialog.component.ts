import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FirestoreService } from '../../core/firestore.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-load-template-dialog',
  templateUrl: './load-template-dialog.component.html',
  styleUrls: ['./load-template-dialog.component.css']
})
export class LoadTemplateDialogComponent implements OnInit {

  templates: Observable<any[]>;

  constructor(private firestore: FirestoreService, 
    private dialogRef: MatDialogRef<LoadTemplateDialogComponent>) { }

  ngOnInit() {
    this.templates = this.firestore.colWithIds$('templates');
  }

  select(id: string) {
    this.dialogRef.close(id);
  }

}
