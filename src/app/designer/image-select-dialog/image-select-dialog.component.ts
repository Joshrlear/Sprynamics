import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-image-select-dialog',
  templateUrl: './image-select-dialog.component.html',
  styleUrls: ['./image-select-dialog.component.scss']
})
export class ImageSelectDialogComponent implements OnInit {

  listing: any;
  photos: string[];

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<ImageSelectDialogComponent>) { }

  ngOnInit() {
    this.listing = this.data.listing;
    this.photos = this.data.listing.photos;
  }

  selectPhoto(photo: string) {
    this.dialogRef.close(photo);
  }

}
