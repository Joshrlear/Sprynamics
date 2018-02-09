import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

declare const Croppie;

@Component({
  selector: 'app-crop-dialog',
  templateUrl: './crop-dialog.component.html',
  styleUrls: ['./crop-dialog.component.scss']
})
export class CropDialogComponent implements OnInit {

  cropper: any;

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<CropDialogComponent>) { }

  ngOnInit() {
    const el = document.getElementById('cropper');
    this.cropper = new Croppie(el, {
      viewport: { width: this.data.width, height: this.data.height },
      boundary: { width: 600, height: 600 },
      showZoomer: true,
      enableOrientation: true,
      enforceBoundary: false
    });
    this.cropper.bind({
      url: this.data.url,
      zoom: false
    });
  }

  rotate(degrees: number) {
    this.cropper.rotate(degrees);
  }

  save() {
    this.cropper.result({
      type: 'base64',
      size: 'viewport',
      format: 'png',
      quality: 1
    }).then(data => {
      this.dialogRef.close(data);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
