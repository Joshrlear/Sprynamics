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
      viewport: { width: 350, height: 350 },
      boundary: { width: 600, height: 600 },
      showZoomer: true,
      enableOrientation: true
    });
    this.cropper.bind({
      url: 'assets/bg/aboutbg_XL.jpg'
    });
  }

  rotate(degrees: number) {
    this.cropper.rotate(degrees);
  }

  save() {
    this.dialogRef.close
  }

}
