import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-user-popup',
  templateUrl: './new-user-popup.component.html',
  styleUrls: ['./new-user-popup.component.scss']
})
export class NewUserPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<NewUserPopupComponent>) { }

  ngOnInit() {
  }

}
