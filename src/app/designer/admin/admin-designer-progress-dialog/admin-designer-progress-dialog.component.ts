import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-admin-designer-progress-dialog',
  templateUrl: './admin-designer-progress-dialog.component.html',
  styleUrls: ['./admin-designer-progress-dialog.component.scss']
})
export class AdminDesignerProgressDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<AdminDesignerProgressDialogComponent>) { }

  ngOnInit() {
  }

}
