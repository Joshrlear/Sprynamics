import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-image-select-dialog',
  template: `
    <h3>Select a photo:</h3>
    <div class="listing-photos-container">
      <img *ngFor="let photo of photos" [src]="photo" (click)="selectPhoto(photo)" class="listing-photo">
    </div>
  `,
  styleUrls: ['./image-select.dialog.scss']
})
export class ImageSelectDialog implements OnInit {

  listing: any;
  photos: string[];

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<ImageSelectDialog>) { }

  ngOnInit() {
    this.listing = this.data.listing;
    this.photos = this.data.listing.photos;
  }

  selectPhoto(photo: string) {
    this.dialogRef.close(photo);
  }

}
