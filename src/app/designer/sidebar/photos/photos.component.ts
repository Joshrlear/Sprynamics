import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CropDialogComponent } from '../../crop-dialog/crop-dialog.component';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  uploadImage() {
    this.dialog.open(CropDialogComponent, {
      data: {}
    });
  }

}
