import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

declare const Cropper;

@Component({
  selector: 'app-crop-dialog',
  templateUrl: './crop.dialog.html',
  styleUrls: ['./crop.dialog.scss']
})
export class CropDialog implements OnInit {

  cropper: any;
  loading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<CropDialog>) { }

  ngOnInit() {
    this.loading = true;

    const el = document.getElementById('cropper-container');
    const image = document.createElement('img');
    image.src = this.data.url;
    el.appendChild(image);
    this.cropper = new Cropper(image, {
      dragMode: 'move',
      viewMode: 1,
      aspectRatio: this.data.width / this.data.height,
      cropBoxResizable: false,

      ready: () => {
        this.cropper.setCropBoxData({
          width: this.data.width,
          height: this.data.height
        });
        const img = this.cropper.getData();
        this.loading = false;
      }
    });
  }

  rotate(degrees: number) {
    this.cropper.rotate(degrees);
  }

  save() {
    const croppedCanvas = this.cropper.getCroppedCanvas({
      width: this.data.width,
      height: this.data.height
    });

    this.dialogRef.close(croppedCanvas.toDataURL('image/png'));
  }

  cancel() {
    this.dialogRef.close();
  }

}
