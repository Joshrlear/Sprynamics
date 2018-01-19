import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
    private dialogRef: MatDialogRef<LoadTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    if (this.data.size) {
      this.templates = this.firestore.colWithIds$('templates', ref => ref.where('productType.size', '==', this.data.size));
    } else {
      this.templates = this.firestore.colWithIds$('templates');
    }
  }

  select(id: string) {
    this.dialogRef.close(id);
  }

}
