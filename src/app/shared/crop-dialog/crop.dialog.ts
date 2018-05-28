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

    console.log(this.data);
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
        this.loading = false;
        this.cropper.setCropBoxData({
          width: this.data.width,
          height: this.data.height
        });

        const img = this.cropper.getData();

        // scale image up if its too small
        // if (img.width < this.data.width || img.height < this.data.height) {
        //   const scaleX = this.data.width / img.width;
        //   const scaleY = this.data.height / img.height;
        //   console.log({ scaleX, scaleY });
        //   if (scaleX > scaleY) {
        //     this.cropper.zoom(-scaleX);
        //   } else {
        //     this.cropper.zoom(-scaleY);
        //   }
        // }

        console.log(this.data);
        console.log(this.cropper.getData());
        console.log(this.cropper.getCropBoxData());
        // console.log(cropdata);
      }
    });
  }

  rotate(degrees: number) {
    this.cropper.rotate(degrees);
  }

  save() {
    // this.cropper.result({
    //   type: 'base64',
    //   // size: 'viewport',
    //   size: {
    //     width: this.data.width / 2,
    //     format: 'png',
    //     quality: 1
    //   }).then(data => {
    //     this.dialogRef.close(data);
    //   });
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
